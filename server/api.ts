import crypto from 'crypto';
import express, { Request, Response, NextFunction } from 'express';
import { initialSalonSettings, initialVehicles } from '../src/lib/mockData';
import { AdminAccount, AuditLog, SalonSettings, Vehicle, Booking, Inquiry } from '../src/types';

const router = express.Router();
router.use(express.json({ limit: '20mb' }));

// In-memory persistent storage for server lifetime (syncs with database/state)
interface StoredAdminAccount extends AdminAccount {
  passwordHash: string;
  salt: string;
}

const SERVER_SECRET = process.env.SESSION_SECRET || 'ias-auto-salon-secure-hmac-token-2026';

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
}

function generateToken(payload: { adminId: string; role: string; email: string }): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const exp = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  const body = Buffer.from(JSON.stringify({ ...payload, exp })).toString('base64url');
  const signature = crypto.createHmac('sha256', SERVER_SECRET).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
}

function verifyToken(token: string): { adminId: string; role: string; email: string } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, body, signature] = parts;
    const expectedSig = crypto.createHmac('sha256', SERVER_SECRET).update(`${header}.${body}`).digest('base64url');
    if (signature !== expectedSig) return null;
    const data = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (Date.now() > data.exp) return null;
    return data;
  } catch {
    return null;
  }
}

// Master storage in server
const adminsStore: Map<string, StoredAdminAccount> = new Map();
const auditLogsStore: AuditLog[] = [];
let salonSettingsStore: SalonSettings = { ...initialSalonSettings };
const vehiclesStore: Map<string, Vehicle> = new Map();
const bookingsStore: Map<string, Booking> = new Map();
const inquiriesStore: Map<string, Inquiry> = new Map();

// Initialize initial vehicles
initialVehicles.forEach((v) => vehiclesStore.set(v.id, v));

function logAudit(adminId: string, adminName: string, action: string, details: string, entityType?: AuditLog['entityType'], entityId?: string) {
  const log: AuditLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    adminId,
    adminName,
    action,
    details,
    entityType,
    entityId,
    timestamp: new Date().toISOString(),
  };
  auditLogsStore.unshift(log);
  // Cap at 200 logs
  if (auditLogsStore.length > 200) auditLogsStore.pop();
}

// Authentication middleware
interface AuthenticatedRequest extends Request {
  user?: { adminId: string; role: string; email: string };
}

function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
  }
  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: 'Unauthorized: Expired or invalid token' });
  }
  const admin = adminsStore.get(payload.adminId);
  if (!admin || admin.status === 'suspended') {
    return res.status(403).json({ error: 'Forbidden: Account suspended or revoked' });
  }
  req.user = payload;
  next();
}

function requireSuperAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'SUPER_ADMIN' || req.user.adminId !== 'IAS-ADMIN-001') {
    return res.status(403).json({ error: 'Forbidden: Super Admin exclusive privilege required' });
  }
  next();
}

// -------------------------------------------------------------
// PUBLIC & STATUS ENDPOINTS
// -------------------------------------------------------------

// Check if initial Super Admin IAS-ADMIN-001 has been set up
router.get('/auth/status', (req: Request, res: Response) => {
  const superAdmin = adminsStore.get('IAS-ADMIN-001');
  res.json({
    superAdminSetupComplete: !!superAdmin,
    superAdminId: 'IAS-ADMIN-001',
    settings: salonSettingsStore,
  });
});

// Setup Initial Super Admin IAS-ADMIN-001
router.post('/auth/setup-super-admin', (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  if (adminsStore.has('IAS-ADMIN-001')) {
    return res.status(400).json({ error: 'Super Admin IAS-ADMIN-001 is already configured.' });
  }

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email is required.' });
  }

  if (!password || password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
  }

  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = hashPassword(password, salt);
  const now = new Date().toISOString();

  const superAdminAccount: StoredAdminAccount = {
    id: 'admin_ias_001',
    adminId: 'IAS-ADMIN-001',
    name: name || 'IAS Owner & Super Admin',
    email,
    role: 'SUPER_ADMIN',
    status: 'active',
    requirePasswordChange: false,
    createdAt: now,
    lastLoginAt: now,
    passwordHash,
    salt,
  };

  adminsStore.set('IAS-ADMIN-001', superAdminAccount);
  logAudit('IAS-ADMIN-001', superAdminAccount.name, 'SETUP_SUPER_ADMIN', 'First-time Super Admin account initialized with secure credentials', 'auth', 'IAS-ADMIN-001');

  const token = generateToken({
    adminId: 'IAS-ADMIN-001',
    role: 'SUPER_ADMIN',
    email,
  });

  res.json({
    success: true,
    message: 'Super Admin IAS-ADMIN-001 configured successfully',
    token,
    admin: {
      adminId: 'IAS-ADMIN-001',
      name: superAdminAccount.name,
      email: superAdminAccount.email,
      role: 'SUPER_ADMIN',
      requirePasswordChange: false,
    },
  });
});

// Admin Login using Administrator ID + Password
router.post('/auth/login', (req: Request, res: Response) => {
  const { adminId, password } = req.body;

  if (!adminId || !password) {
    return res.status(400).json({ error: 'Administrator ID and password are required.' });
  }

  const cleanId = String(adminId).trim().toUpperCase();
  const account = adminsStore.get(cleanId);

  if (!account) {
    return res.status(401).json({ error: 'Invalid Administrator ID or password.' });
  }

  if (account.status === 'suspended') {
    return res.status(403).json({ error: 'This administrator account has been suspended by the Super Admin.' });
  }

  const expectedHash = hashPassword(password, account.salt);
  if (expectedHash !== account.passwordHash) {
    logAudit(cleanId, account.name, 'FAILED_LOGIN_ATTEMPT', 'Invalid password entered', 'auth', cleanId);
    return res.status(401).json({ error: 'Invalid Administrator ID or password.' });
  }

  account.lastLoginAt = new Date().toISOString();
  adminsStore.set(cleanId, account);

  logAudit(cleanId, account.name, 'ADMIN_LOGIN', 'Administrator signed into session', 'auth', cleanId);

  const token = generateToken({
    adminId: account.adminId,
    role: account.role,
    email: account.email,
  });

  res.json({
    success: true,
    token,
    admin: {
      adminId: account.adminId,
      name: account.name,
      email: account.email,
      role: account.role,
      requirePasswordChange: account.requirePasswordChange,
    },
  });
});

// Change Password (Self)
router.post('/auth/change-password', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  const adminId = req.user!.adminId;
  const account = adminsStore.get(adminId);

  if (!account) {
    return res.status(404).json({ error: 'Account not found' });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters long.' });
  }

  const oldHash = hashPassword(oldPassword, account.salt);
  if (oldHash !== account.passwordHash) {
    return res.status(400).json({ error: 'Current password does not match.' });
  }

  const newSalt = crypto.randomBytes(16).toString('hex');
  account.salt = newSalt;
  account.passwordHash = hashPassword(newPassword, newSalt);
  account.requirePasswordChange = false;
  adminsStore.set(adminId, account);

  logAudit(adminId, account.name, 'PASSWORD_CHANGED', 'Administrator changed their password', 'auth', adminId);

  res.json({ success: true, message: 'Password updated successfully' });
});

// -------------------------------------------------------------
// SUPER ADMIN EXCLUSIVE: ADMIN USER MANAGEMENT
// -------------------------------------------------------------

// List all administrators
router.get('/admin/admins', requireAuth, requireSuperAdmin, (req: AuthenticatedRequest, res: Response) => {
  const list = Array.from(adminsStore.values()).map(({ passwordHash, salt, ...safe }) => safe);
  res.json({ admins: list });
});

// Create new administrator account
router.post('/admin/admins', requireAuth, requireSuperAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { adminId, name, email, role, temporaryPassword } = req.body;

  if (!adminId || !name || !email || !temporaryPassword) {
    return res.status(400).json({ error: 'Admin ID, Name, Email, and Temporary Password are required.' });
  }

  const cleanId = String(adminId).trim().toUpperCase();

  if (cleanId === 'IAS-ADMIN-001') {
    return res.status(400).json({ error: 'IAS-ADMIN-001 is reserved for the Super Admin Owner.' });
  }

  if (adminsStore.has(cleanId)) {
    return res.status(400).json({ error: `Administrator ID ${cleanId} is already assigned.` });
  }

  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = hashPassword(temporaryPassword, salt);
  const now = new Date().toISOString();

  const newAdmin: StoredAdminAccount = {
    id: `admin_${cleanId.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
    adminId: cleanId,
    name,
    email,
    role: role === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : 'ADMIN',
    status: 'active',
    requirePasswordChange: true,
    createdAt: now,
    passwordHash,
    salt,
  };

  adminsStore.set(cleanId, newAdmin);
  logAudit('IAS-ADMIN-001', 'IAS Owner', 'CREATE_ADMIN', `Created new administrator: ${cleanId} (${name}, ${newAdmin.role})`, 'admin', cleanId);

  const { passwordHash: _, salt: __, ...safe } = newAdmin;
  res.json({ success: true, admin: safe });
});

// Change Admin Role
router.patch('/admin/admins/:adminId/role', requireAuth, requireSuperAdmin, (req: AuthenticatedRequest, res: Response) => {
  const targetId = req.params.adminId.toUpperCase();
  const { role } = req.body;

  if (targetId === 'IAS-ADMIN-001') {
    return res.status(400).json({ error: 'Cannot modify Super Admin IAS-ADMIN-001 role!' });
  }

  const account = adminsStore.get(targetId);
  if (!account) return res.status(404).json({ error: 'Administrator not found.' });

  account.role = role === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : 'ADMIN';
  adminsStore.set(targetId, account);

  logAudit('IAS-ADMIN-001', 'IAS Owner', 'CHANGE_ADMIN_ROLE', `Changed role for ${targetId} to ${account.role}`, 'admin', targetId);

  const { passwordHash, salt, ...safe } = account;
  res.json({ success: true, admin: safe });
});

// Change Admin Status (suspend/reactivate)
router.patch('/admin/admins/:adminId/status', requireAuth, requireSuperAdmin, (req: AuthenticatedRequest, res: Response) => {
  const targetId = req.params.adminId.toUpperCase();
  const { status } = req.body;

  if (targetId === 'IAS-ADMIN-001') {
    return res.status(400).json({ error: 'Cannot suspend or disable Super Admin IAS-ADMIN-001!' });
  }

  const account = adminsStore.get(targetId);
  if (!account) return res.status(404).json({ error: 'Administrator not found.' });

  account.status = status === 'suspended' ? 'suspended' : 'active';
  adminsStore.set(targetId, account);

  logAudit('IAS-ADMIN-001', 'IAS Owner', 'CHANGE_ADMIN_STATUS', `Changed status for ${targetId} to ${account.status}`, 'admin', targetId);

  const { passwordHash, salt, ...safe } = account;
  res.json({ success: true, admin: safe });
});

// Reset Admin Password
router.post('/admin/admins/:adminId/reset-password', requireAuth, requireSuperAdmin, (req: AuthenticatedRequest, res: Response) => {
  const targetId = req.params.adminId.toUpperCase();
  const { newTemporaryPassword } = req.body;

  if (!newTemporaryPassword || newTemporaryPassword.length < 6) {
    return res.status(400).json({ error: 'Temporary password must be at least 6 characters.' });
  }

  const account = adminsStore.get(targetId);
  if (!account) return res.status(404).json({ error: 'Administrator not found.' });

  const salt = crypto.randomBytes(16).toString('hex');
  account.salt = salt;
  account.passwordHash = hashPassword(newTemporaryPassword, salt);
  account.requirePasswordChange = true;
  adminsStore.set(targetId, account);

  logAudit('IAS-ADMIN-001', 'IAS Owner', 'RESET_ADMIN_PASSWORD', `Reset password and required change for ${targetId}`, 'admin', targetId);

  res.json({ success: true, message: `Password for ${targetId} reset successfully` });
});

// Delete Admin Account
router.delete('/admin/admins/:adminId', requireAuth, requireSuperAdmin, (req: AuthenticatedRequest, res: Response) => {
  const targetId = req.params.adminId.toUpperCase();

  if (targetId === 'IAS-ADMIN-001') {
    return res.status(400).json({ error: 'Cannot delete Super Admin IAS-ADMIN-001!' });
  }

  if (!adminsStore.has(targetId)) {
    return res.status(404).json({ error: 'Administrator not found.' });
  }

  adminsStore.delete(targetId);
  logAudit('IAS-ADMIN-001', 'IAS Owner', 'DELETE_ADMIN', `Permanently deleted administrator account: ${targetId}`, 'admin', targetId);

  res.json({ success: true, message: `Administrator ${targetId} deleted.` });
});

// -------------------------------------------------------------
// AUDIT LOGS
// -------------------------------------------------------------
router.get('/admin/audit-logs', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  res.json({ logs: auditLogsStore });
});

// -------------------------------------------------------------
// SALON SETTINGS (Public GET, Super Admin PUT)
// -------------------------------------------------------------
router.get('/settings', (req: Request, res: Response) => {
  res.json({ settings: salonSettingsStore });
});

router.put('/settings', requireAuth, requireSuperAdmin, (req: AuthenticatedRequest, res: Response) => {
  const updates = req.body;
  salonSettingsStore = {
    ...salonSettingsStore,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  logAudit(
    'IAS-ADMIN-001',
    'IAS Owner',
    'UPDATE_SETTINGS',
    `Updated website settings. Telegram: ${salonSettingsStore.telegramLink}, Instagram: ${salonSettingsStore.instagramLink}`,
    'settings',
    'global'
  );

  res.json({ success: true, settings: salonSettingsStore });
});

// -------------------------------------------------------------
// VEHICLES MANAGEMENT
// -------------------------------------------------------------
router.get('/vehicles', (req: Request, res: Response) => {
  const all = Array.from(vehiclesStore.values());
  res.json({ vehicles: all });
});

router.post('/vehicles', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const data = req.body;
  const id = `veh-${Date.now()}`;
  const now = new Date().toISOString();

  const newVehicle: Vehicle = {
    ...data,
    id,
    createdByAdminId: req.user!.adminId,
    createdAt: now,
    updatedAt: now,
  };

  vehiclesStore.set(id, newVehicle);
  logAudit(req.user!.adminId, req.user!.adminId, 'ADD_VEHICLE', `Added new vehicle: ${newVehicle.brand} ${newVehicle.model} ($${newVehicle.price})`, 'vehicle', id);

  res.json({ success: true, vehicle: newVehicle });
});

router.put('/vehicles/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id;
  const existing = vehiclesStore.get(id);
  if (!existing) return res.status(404).json({ error: 'Vehicle not found' });

  const updated: Vehicle = {
    ...existing,
    ...req.body,
    id,
    updatedAt: new Date().toISOString(),
  };

  vehiclesStore.set(id, updated);
  logAudit(req.user!.adminId, req.user!.adminId, 'UPDATE_VEHICLE', `Updated vehicle: ${updated.brand} ${updated.model} (Status: ${updated.status})`, 'vehicle', id);

  res.json({ success: true, vehicle: updated });
});

router.delete('/vehicles/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id;
  const existing = vehiclesStore.get(id);
  if (!existing) return res.status(404).json({ error: 'Vehicle not found' });

  vehiclesStore.delete(id);
  logAudit(req.user!.adminId, req.user!.adminId, 'DELETE_VEHICLE', `Deleted vehicle: ${existing.brand} ${existing.model}`, 'vehicle', id);

  res.json({ success: true, message: 'Vehicle deleted' });
});

// -------------------------------------------------------------
// BOOKINGS & INQUIRIES
// -------------------------------------------------------------
router.get('/bookings', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  res.json({ bookings: Array.from(bookingsStore.values()) });
});

router.post('/bookings', (req: Request, res: Response) => {
  const { fullName, phone, vehicleId, vehicleTitle, preferredDate, preferredTime, comments } = req.body;
  if (!fullName || !phone || !vehicleId || !preferredDate) {
    return res.status(400).json({ error: 'Required fields missing' });
  }

  const id = `book-${Date.now()}`;
  const booking: Booking = {
    id,
    fullName,
    phone,
    vehicleId,
    vehicleTitle: vehicleTitle || 'Vehicle',
    preferredDate,
    preferredTime: preferredTime || '14:00',
    comments,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  bookingsStore.set(id, booking);
  res.json({ success: true, booking });
});

router.patch('/bookings/:id/status', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id;
  const booking = bookingsStore.get(id);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });

  booking.status = req.body.status;
  bookingsStore.set(id, booking);

  logAudit(req.user!.adminId, req.user!.adminId, 'UPDATE_BOOKING', `Updated test-drive booking ${id} status to ${booking.status}`, 'booking', id);

  res.json({ success: true, booking });
});

router.get('/inquiries', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  res.json({ inquiries: Array.from(inquiriesStore.values()) });
});

router.post('/inquiries', (req: Request, res: Response) => {
  const { fullName, phone, email, message } = req.body;
  if (!fullName || !phone || !message) {
    return res.status(400).json({ error: 'Required fields missing' });
  }

  const id = `inq-${Date.now()}`;
  const inquiry: Inquiry = {
    id,
    fullName,
    phone,
    email,
    message,
    status: 'new',
    createdAt: new Date().toISOString(),
  };

  inquiriesStore.set(id, inquiry);
  res.json({ success: true, inquiry });
});

router.patch('/inquiries/:id/status', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id;
  const inquiry = inquiriesStore.get(id);
  if (!inquiry) return res.status(404).json({ error: 'Inquiry not found' });

  inquiry.status = req.body.status;
  inquiriesStore.set(id, inquiry);

  res.json({ success: true, inquiry });
});

export default router;
