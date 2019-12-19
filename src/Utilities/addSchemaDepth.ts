
export default async function (schema: object): Promise<object> {
	const stringified = await JSON.stringify(schema, (key, value) => {

	});
}
