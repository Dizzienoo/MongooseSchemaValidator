import { EAllowedTypes } from "../interfaces";


/**
 * Checks if a Schema Key is one of the EAllowedTypes
 * @param schemaKeys The Schema Key to check
 *
 * @returns {EAllowedTypes} Allowed type if appropriate or null
 */
export default function keyIsAllowedType(schemaKey: string): EAllowedTypes {
	if (schemaKey === EAllowedTypes.BOOLEAN_TYPE) { return EAllowedTypes.BOOLEAN_TYPE; }
	if (schemaKey === EAllowedTypes.DATE_TYPE) { return EAllowedTypes.DATE_TYPE; }
	if (schemaKey === EAllowedTypes.MIXED_TYPE) { return EAllowedTypes.MIXED_TYPE; }
	if (schemaKey === EAllowedTypes.MONGOOSE_TYPE) { return EAllowedTypes.MONGOOSE_TYPE; }
	if (schemaKey === EAllowedTypes.NUMBER_TYPE) { return EAllowedTypes.NUMBER_TYPE; }
	if (schemaKey === EAllowedTypes.STRING_TYPE) { return EAllowedTypes.STRING_TYPE; }
	return null;
}
