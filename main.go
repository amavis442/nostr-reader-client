package main

import (
	"github.com/gofiber/fiber/v2"
)

func main() {
	app := fiber.New()
	app.Static("/", "./public")
	//app.Get("/", mainPage)
	app.Listen(":3030")
}

func mainPage(c *fiber.Ctx) error {
	//This function will be see different soon
	return c.Render("mainpage", nil)
}
