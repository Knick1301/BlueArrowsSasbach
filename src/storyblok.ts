// Im Dev-Server (und damit im Visual Editor) Entwürfe, im Produktions-Build nur Veröffentlichtes.
export const STORYBLOK_VERSION = import.meta.env.DEV ? 'draft' : 'published'
export const CONFIG_STORY = 'global/config'
