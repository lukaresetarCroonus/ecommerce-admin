import seleniumTest, { config } from "."

seleniumTest("Login page", "login", ({ loading, element }) => {

	test("Appears", async () => {
		await loading()

		const welcomeElement = await element.css("h5")
		expect(await welcomeElement.getText()).toEqual("Dobrodošli na Croonus CMS.")
	})

	test("Successful login", async () => {
		await loading()

		// Submit the login form
		;(await element.css("input[type='text']")).sendKeys(config.login.user)
		;(await element.css("input[type=password]")).sendKeys(config.login.pass)
		;(await element.css("button[type=submit]")).click()

		// Await for the success message
		const confirmation = await (await element.css(".sidebar-welcome h5")).getText()
		expect(confirmation).toEqual("Dobrodošli")
	})

}, false)