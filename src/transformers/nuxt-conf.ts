import ts from "typescript"

export const addModulesToNuxtConfig = (sourceCode: string, newModules: string[]) => {
	const sourceFile = ts.createSourceFile(
		"nuxt.config.ts",
		sourceCode,
		ts.ScriptTarget.Latest,
		true,
	)

	const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed })

	const transformer = (context: ts.TransformationContext) => (rootNode: ts.Node) => {
		function visit(node: ts.Node): ts.Node {
			// biome-ignore lint/suspicious/noConfusingLabels: idk might refactor later
			matches: {
				if (!ts.isExportAssignment(node)) break matches

				const { expression } = node
				if (!ts.isCallExpression(expression)) break matches

				const [configObject] = expression.arguments
				if (!ts.isObjectLiteralExpression(configObject)) break matches

				const updatedProperties = [...configObject.properties]

				const modulesProperty = configObject.properties.find(
					(prop): prop is ts.PropertyAssignment => {
						return ts.isPropertyAssignment(prop) && prop.name.getText() === "modules"
					},
				)

				if (modulesProperty) {
					if (!ts.isArrayLiteralExpression(modulesProperty.initializer)) break matches

					const existingModules = modulesProperty.initializer.elements.map((el) => {
						if (!ts.isStringLiteral(el)) throw new Error(`Invalid module ${el}`)
						return el.text
					})

					const updatedModules = [...new Set([...existingModules, ...newModules])]

					const stringLiterals = updatedModules.map((m) => {
						return ts.factory.createStringLiteral(m)
					})

					const newModulesArray = ts.factory.createArrayLiteralExpression(
						stringLiterals,
						true,
					)

					updatedProperties[updatedProperties.indexOf(modulesProperty)] =
						ts.factory.createPropertyAssignment("modules", newModulesArray)
				} else {
					const stringLiterals = newModules.map((m) => {
						return ts.factory.createStringLiteral(m)
					})

					const newModulesArray = ts.factory.createArrayLiteralExpression(
						stringLiterals,
						true,
					)

					updatedProperties.push(
						ts.factory.createPropertyAssignment("modules", newModulesArray),
					)
				}

				const updatedConfigObject = ts.factory.createObjectLiteralExpression(
					updatedProperties,
					true,
				)

				if (!ts.isCallExpression(node.expression)) break matches

				return ts.factory.updateExportAssignment(
					node,
					node.modifiers,
					ts.factory.updateCallExpression(
						node.expression,
						node.expression.expression,
						node.expression.typeArguments,
						[updatedConfigObject],
					),
				)
			}
			return ts.visitEachChild(node, visit, context)
		}
		return ts.visitNode(rootNode, visit)
	}

	const result = ts.transform(sourceFile, [transformer])
	const transformedSourceFile = result.transformed[0]
	const updatedCode = printer.printNode(
		ts.EmitHint.SourceFile,
		transformedSourceFile,
		sourceFile,
	)

	return updatedCode
}
