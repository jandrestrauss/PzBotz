// ...existing code...

const roles = {
  player: ['basicCommand'],
  moderator: ['basicCommand', 'playerManagement'],
  admin: ['basicCommand', 'playerManagement', 'serverControl'],
  owner: ['basicCommand', 'playerManagement', 'serverControl', 'configurationAccess']
};

const checkPermission = (role, permission) => {
  return roles[role] && roles[role].includes(permission);
};

// ...existing code...

module.exports = { checkPermission, roles };
