import seleniumTest from "."

seleniumTest("B2B Configuration", "B2B-settings", ({ loading, common }) => {

	test("Appears", async () => {
		await loading()
		expect(await common.pageTitle()).toEqual("B2B eCommerce podešavanje modula")
	})

})
