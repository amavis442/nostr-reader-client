package main

import (
	"github.com/gofiber/fiber/v2"
)

func main() {
	app := fiber.New()
	app.Static("/", "./public")
	// SPA-fallback: serveer index.html voor verzoeken die niet op een statisch
	// bestand matchen, zodat client-side routes (bv. /relay) blijven werken bij
	// een refresh of deep-link. Fiber's Static valt bij een niet-gevonden bestand
	// door naar de volgende handler.
	app.Use(func(c *fiber.Ctx) error {
		return c.SendFile("./public/index.html")
	})
	app.Listen(":3030")
}
