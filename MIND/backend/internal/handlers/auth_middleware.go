package handlers

import (
	"net/http"
	"notes-app/internal/db"
	"notes-app/internal/models"
	"notes-app/internal/utils"
	"strings"

	"github.com/gin-gonic/gin"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get token from Authorization header
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			utils.ErrorJSON(c, http.StatusUnauthorized, "Authorization header required")
			c.Abort()
			return
		}

		// Check if token starts with "Bearer "
		if !strings.HasPrefix(authHeader, "Bearer ") {
			utils.ErrorJSON(c, http.StatusUnauthorized, "Invalid authorization header format")
			c.Abort()
			return
		}

		// Extract token
		tokenString := strings.TrimPrefix(authHeader, "Bearer ")

		// Validate token
		claims, err := models.ValidateJWT(tokenString)
		if err != nil {
			utils.ErrorJSON(c, http.StatusUnauthorized, "Invalid or expired token")
			c.Abort()
			return
		}

		// Get user ID from claims
		userID, ok := claims["user_id"].(float64)
		if !ok {
			utils.ErrorJSON(c, http.StatusUnauthorized, "Invalid token claims")
			c.Abort()
			return
		}

		// Fetch user from database
		var user models.User
		if err := db.GetDB().First(&user, uint(userID)).Error; err != nil {
			utils.ErrorJSON(c, http.StatusUnauthorized, "User not found")
			c.Abort()
			return
		}

		// Set user in context
		c.Set("user", user)
		c.Set("user_id", user.ID)

		c.Next()
	}
}

