import {MaledictionDataModel} from "./features/vampire/malediction-data-model.mjs";
import {SanctuaryDataModel} from "./features/warden/sanctuary-data-model.mjs";
import {LOG_MESSAGE, MODULE} from "./constants.mjs";
import {registerClassSettings, registerModuleSettings, SETTINGS} from "./settings.mjs";

export const registeredFeatures = {}

Hooks.once('init', async function () {
    console.log(LOG_MESSAGE, "Initialization started")

    console.log(LOG_MESSAGE, "Registering settings")
    registerModuleSettings()
    registerClassSettings()

    console.log(LOG_MESSAGE, "Registering class features")
    const templates = {}

    if (game.settings.get(MODULE, SETTINGS.classes.vampire)) {
        registeredFeatures.malediction = CONFIG.FU.classFeatureRegistry.register(MODULE, "malediction", MaledictionDataModel)

        Object.assign(templates, {
            "fabula-ultima-homebrew.malediction.sheet": "modules/fabula-ultima-homebrew/templates/vampire/malediction-sheet.hbs",
            "fabula-ultima-homebrew.malediction.preview": "modules/fabula-ultima-homebrew/templates/vampire/malediction-preview.hbs",
        });
    }
    if (game.settings.get(MODULE, SETTINGS.classes.warden)) {
        registeredFeatures.sanctuary = CONFIG.FU.classFeatureRegistry.register(MODULE, "sanctuary", SanctuaryDataModel);

        Object.assign(templates, {
            "fabula-ultima-homebrew.sanctuary.sheet": "modules/fabula-ultima-homebrew/templates/warden/sanctuary-sheet.hbs",
            "fabula-ultima-homebrew.sanctuary.preview": "modules/fabula-ultima-homebrew/templates/warden/sanctuary-preview.hbs",
        });
    }

    loadTemplates(templates)

    console.log(LOG_MESSAGE, "Class Features registered", registeredFeatures)

    Handlebars.registerHelper("math", mathHelper)

    console.log(LOG_MESSAGE, "Initialized")
});

function mathHelper(left, operator, right) {
    left = parseFloat(left);
    right = parseFloat(right);
    return {
        "+": left + right,
        "-": left - right,
        "*": left * right,
        "/": left / right,
        "%": left % right
    }[operator];
}

Hooks.once("ready", async function () {
    if (game.settings.get(MODULE, SETTINGS.welcomeMessage) && game.user === game.users.activeGM) {
        /** @type ChatMessageData */
        const message = {
            speaker: {alias: "Fabula Ultima - Community Homebrew"},
            whisper: ChatMessage.getWhisperRecipients("GM"),
            content: `
<div>
    <div style="margin-bottom: .5em">${game.i18n.localize("FU-HB.welcomeMessage.thankYou")}</div>
    <div style="margin-bottom: .5em">${game.i18n.localize("FU-HB.welcomeMessage.explanation")}</div>
    <div>${game.i18n.localize("FU-HB.welcomeMessage.warning")}</div>
</div>`
        };

        ChatMessage.create(message);
        game.settings.set(MODULE, SETTINGS.welcomeMessage, false);
    }
})