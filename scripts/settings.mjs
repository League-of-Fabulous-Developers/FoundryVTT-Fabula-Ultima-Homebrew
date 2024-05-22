import { MODULE } from "./constants.mjs";

export const SETTINGS = {
    welcomeMessage: "welcomeMessage",
    classes: {
        vampire: "classes.vampire",
        warden: "classes.warden",
    }
}

export function registerModuleSettings() {
    game.settings.register(MODULE, SETTINGS.welcomeMessage, {
        name: game.i18n.localize("FU-HB.settings.welcomeMessage.name"),
        hint: game.i18n.localize("FU-HB.settings.welcomeMessage.hint"),
        scope: "world",
        config: true,
        requiresReload: false,
        type: Boolean,
        default: true
    })
}

export function registerClassSettings() {
    game.settings.register(MODULE, SETTINGS.classes.vampire, {
        name: game.i18n.localize("FU-HB.settings.classes.vampire.name"),
        hint: game.i18n.localize("FU-HB.settings.classes.vampire.hint"),
        scope: "world",
        config: true,
        requiresReload: true,
        type: Boolean,
        default: false
    });
    
    game.settings.register(MODULE, SETTINGS.classes.warden, {
        name: game.i18n.localize("FU-HB.settings.classes.warden.name"),
        hint: game.i18n.localize("FU-HB.settings.classes.warden.hint"),
        scope: "world",
        config: true,
        requiresReload: true,
        type: Boolean,
        default: false
    });
}
