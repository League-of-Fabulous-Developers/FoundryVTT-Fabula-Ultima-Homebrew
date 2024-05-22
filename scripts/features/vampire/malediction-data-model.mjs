/**
 * @extends projectfu.RollableClassFeatureDataModel
 * @property {string} description
 */
export class MaledictionDataModel extends projectfu.RollableClassFeatureDataModel {

    static defineSchema() {
		const { SchemaField, HTMLField, NumberField, StringField, BooleanField } = foundry.data.fields;
		return {
			accuracy: new SchemaField({
                attr1: new StringField({initial: "mig", choices: () => Object.keys(CONFIG.FU.attributeAbbreviations)}),
                attr2: new StringField({initial: "wlp", choices: () => Object.keys(CONFIG.FU.attributeAbbreviations)}),
                modifier: new NumberField({initial: 0})
            }),
            damage: new SchemaField({
                type: new StringField({initial: "physical", choices: Object.keys(CONFIG.FU.damageTypes)}),
                bonus: new NumberField({initial: 0})
            }),
			description: new HTMLField(),
			hpCost: new SchemaField({ value: new NumberField() }),
			maxTarget: new SchemaField({ value: new NumberField({ initial: 1, min: 1, integer: true, nullable: false }) }),
			target: new SchemaField({ value: new StringField() }),
			duration: new SchemaField({ value: new StringField() }),
			isOffensive: new SchemaField({ value: new BooleanField() }),
			hasRoll: new SchemaField({ value: new BooleanField() }),
		};
	}

	static get template() {
		return "fabula-ultima-homebrew.malediction.sheet";
	}

	static get previewTemplate() {
		return "fabula-ultima-homebrew.malediction.preview";
	}

	static get translation() {
		return 'FU-HB.vampire.label';
	}

	static getAdditionalData(model) {
        return {
            attributes: CONFIG.FU.attributeAbbreviations,
            damageTypes: CONFIG.FU.damageTypes,
        }
    }

	    /**
     * @override
     */
		static async roll(model, item, hrZero) {

			const actor = item.actor;
			if (!actor) {
				return;
			}
	
			const {
				accuracyCheck: globalAccuracyBonus = 0
			} = actor.system.bonuses.accuracy
	
			const checkData = {
				attr1: {
					attribute: model.accuracy.attr1,
					dice: actor.system.attributes[model.accuracy.attr1].current
				},
				attr2: {
					attribute: model.accuracy.attr2,
					dice: actor.system.attributes[model.accuracy.attr2].current
				},
				modifier: model.accuracy.modifier,
				bonus: globalAccuracyBonus
			}

			const checkSpell = {
				_type: "spell",
				name: item.name,
				img: item.img,
				id: item.id,
				duration: model.duration.value,
				target: model.target.value,
				mpCost: model.hpCost.value,
				type: model.type,
				summary: item.system.summary.value,
				description: await TextEditor.enrichHTML(model.description)
			}
			
			// const {
			// 	[model.type]: typeDamageBonus = 0
			// } = actor.system.bonuses.damage

			const checkDamage = {
				type: model.damage.type,
				bonus: model.damage.bonus,
				hrZero
			}
	
			return game.projectfu.rollCheck({
				check: checkData,
				details: checkSpell,
				damage: checkDamage
			}).then(value => game.projectfu.createCheckMessage(value, {[projectfu.SYSTEM]: {[projectfu.Flags.ChatMessage.Item]: item}}))
		}
}