Hooks.once("polyglot.init", (LanguageProvider) => {
  class Arm5eSystemLanguageProvider extends LanguageProvider {
    defaultFont = "Olde English";
    requiresReady = true;

    languages = {};

    loadLanguages() {
      let languages = new Set();

      for (let actor of game.actors.contents.filter(
        (x) => x.type === "player" || x.type === "npc"
      )) {
        const actorLanguages = actor.system.abilities
          .filter((e) => {
            return (
              e.system.key === "livingLanguage" ||
              e.system.key === "deadLanguage"
            );
          })
          .forEach((lang) => languages.add(lang.system.option));
      }

      for (let lang of languages) {
        this.addLanguage(lang);
      }

      super.loadLanguages();
    }

    getUserLanguages(actor) {
      let known_languages = new Set();
      let literate_languages = new Set();

      if (actor.type !== "player" && actor.type !== "npc") {
        return [known_languages, literate_languages];
      }

      const languages = actor.system.abilities
        .filter((e) => {
          return (
            (e.system.key === "livingLanguage" ||
              e.system.key === "deadLanguage") &&
            e.system.finalScore >= 1
          );
        })
        .map((lang) => lang.system.option.toLowerCase());
      for (let lang of languages) {
        known_languages.add(lang);
        if (lang.finalScore >= 4) {
          literate_languages.add(lang);
        }
      }
      return [known_languages, literate_languages];
    }
  }

  game.polyglot.api.registerModule(
    "arm5e-polyglot",
    Arm5eSystemLanguageProvider
  );
});
