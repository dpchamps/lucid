import {register as registerWithContext} from "./modules/with-context.js";
import {register as registerImportFragment} from "./modules/importFragment.js";
import {register as registerFragment} from "./modules/fragment.js";

registerImportFragment();
registerWithContext();
registerFragment();