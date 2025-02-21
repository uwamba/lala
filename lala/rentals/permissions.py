from rest_framework.permissions import BasePermission
from rest_framework.exceptions import PermissionDenied  # Import PermissionDenied

class IsHostUser(BasePermission):
    """
    Custom permission to only allow 'host' users to access this view.
    """
    def has_permission(self, request, view):
        if request.user:
            if request.user.role == 'host':
                return True
            else:
                raise PermissionDenied("You do not have the required 'host' role.")  # Raise the permission error
        raise PermissionDenied("User is not authenticated.")  # Raise error if user is not authenticated
