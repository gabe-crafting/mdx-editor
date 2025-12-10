package main

import (
	"embed"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/menu"
	"github.com/wailsapp/wails/v2/pkg/menu/keys"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	// Create an instance of the app structure
	app := NewApp()

	// Build native application menu
	appMenu := menu.NewMenu()
	fileMenu := appMenu.AddSubmenu("File")
	fileMenu.AddText("Open", keys.CmdOrCtrl("O"), func(cd *menu.CallbackData) {
		runtime.EventsEmit(app.ctx, "menu:file:open")
	})
	fileMenu.AddText("Save", keys.CmdOrCtrl("S"), func(cd *menu.CallbackData) {
		runtime.EventsEmit(app.ctx, "menu:file:save")
	})
	fileMenu.AddText("Save As", keys.CmdOrCtrl("Shift+S"), func(cd *menu.CallbackData) {
		runtime.EventsEmit(app.ctx, "menu:file:saveas")
	})
	fileMenu.AddSeparator()
	fileMenu.AddText("Quit", keys.CmdOrCtrl("Q"), func(cd *menu.CallbackData) {
		runtime.Quit(app.ctx)
	})

	// Create application with options
	err := wails.Run(&options.App{
		Title:  "mdxEditor",
		Width:  1024,
		Height: 768,
		Menu:   appMenu,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:        app.startup,
		Bind: []interface{}{
			app,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
