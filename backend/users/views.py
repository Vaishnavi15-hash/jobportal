from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token  # Add this import
from .models import User
from .serializers import UserSerializer
from rest_framework.permissions import AllowAny

# Register a new user
class RegisterUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

# Login user using email
class LoginUserView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        # Try to find user by email
        try:
            user_obj = User.objects.get(email=email)
            # Authenticate using Django's username field internally
            user = authenticate(request, username=user_obj.username, password=password)
        except User.DoesNotExist:
            user = None

        if user is not None:
            # Get or create token for the user
            token, created = Token.objects.get_or_create(user=user)
            
            # Return user data along with token
            serializer = UserSerializer(user)
            return Response({
                'token': token.key,  # Add token to response
                'user': serializer.data
            }, status=status.HTTP_200_OK)
        
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)