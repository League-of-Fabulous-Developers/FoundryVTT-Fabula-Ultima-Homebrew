/**
 * @extends projectfu.ClassFeatureDataModel
 * @property {string} description
 * @property {string} haunt
 * @property {string} ritual
 */
export class SanctuaryDataModel extends projectfu.ClassFeatureDataModel {

	static defineSchema() {
		const { HTMLField } = foundry.data.fields;
		return {
			description: new HTMLField(),
			haunt: new HTMLField(),
			ritual: new HTMLField(),
		};
	}

	static get template() {
		return "fabula-ultima-homebrew.sanctuary.sheet";
	}

	static get previewTemplate() {
		return "fabula-ultima-homebrew.sanctuary.preview";
	}

	static get translation() {
		return 'FU-HB.warden.label';
	}
}
