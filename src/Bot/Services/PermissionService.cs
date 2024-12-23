using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

public class PermissionService
{
    private readonly ILogger<PermissionService> _logger;
    private readonly Dictionary<string, List<string>> _rolePermissions;

    public PermissionService(ILogger<PermissionService> logger)
    {
        _logger = logger;
        _rolePermissions = new Dictionary<string, List<string>>
        {
            { "Player", new List<string> { "BasicCommands" } },
            { "Moderator", new List<string> { "BasicCommands", "PlayerManagement" } },
            { "Admin", new List<string> { "BasicCommands", "PlayerManagement", "FullServerControl" } },
            { "Owner", new List<string> { "BasicCommands", "PlayerManagement", "FullServerControl", "ConfigurationAccess" } }
        };
    }

    public bool HasPermission(string role, string permission)
    {
        if (_rolePermissions.TryGetValue(role, out var permissions))
        {
            return permissions.Contains(permission);
        }

        _logger.LogWarning($"Role {role} does not exist.");
        return false;
    }

    public async Task AddPermissionToRole(string role, string permission)
    {
        if (_rolePermissions.TryGetValue(role, out var permissions))
        {
            if (!permissions.Contains(permission))
            {
                permissions.Add(permission);
                _logger.LogInformation($"Permission {permission} added to role {role}.");
            }
        }
        else
        {
            _logger.LogWarning($"Role {role} does not exist.");
        }
    }

    public async Task RemovePermissionFromRole(string role, string permission)
    {
        if (_rolePermissions.TryGetValue(role, out var permissions))
        {
            if (permissions.Contains(permission))
            {
                permissions.Remove(permission);
                _logger.LogInformation($"Permission {permission} removed from role {role}.");
            }
        }
        else
        {
            _logger.LogWarning($"Role {role} does not exist.");
        }
    }

    public async Task<List<string>> GetPermissionsForRole(string role)
    {
        if (_rolePermissions.TryGetValue(role, out var permissions))
        {
            return permissions;
        }

        _logger.LogWarning($"Role {role} does not exist.");
        return new List<string>();
    }
}
