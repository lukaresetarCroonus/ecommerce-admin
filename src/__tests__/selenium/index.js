const webdriver = require("selenium-webdriver")
const { until, By } = require("selenium-webdriver")
require("chromedriver")

// Config
export const config = {
	timeout  : 20000,
	login    : {
		user : "info@croonus.com",
		pass : "CroonusTechMasterAdmin923!",
		sleep: 1000
	},
	element  : {
		timeout: 4000
	},
	webdriver: {
		capabilities: {
			browserName: "chrome"
		}
	}
}

// Run at least one test, to keep the Jest happy
test("Initialize", () => expect("Selenium").toEqual("Selenium"))

/**
 * Selenium test helper.
 *
 * @param {string} name The name of the test.
 * @param {string} url The absolute path to the page to test, without the domain.
 * @param {function({})} tests The tests to execute.
 * @param {boolean} login Set to false in order to skip the login.
 */
const seleniumTest = (name, url, tests, login = true) => {

	// Load the browser driver
	const driver = new webdriver.Builder().withCapabilities(config.webdriver.capabilities).build()

	// Clean up
	afterAll(async () => {
		await driver.quit()
	}, config.timeout)

	// All the helpers to provide to the actual test
	const helpers = {

		// Reference to the drive
		driver,

		// Fetch elements
		element: {
			custom: async (element, timeout = 3000) => await driver.wait(until.elementIsVisible(await driver.wait(until.elementLocated(element), timeout)), timeout),
			id    : async (id, timeout = 3000) => helpers.element.custom(By.id(id), timeout),
			name  : async (name, timeout = 3000) => helpers.element.custom(By.name(name), timeout),
			css   : async (selector, timeout = 3000) => helpers.element.custom(By.css(selector), timeout),
			class : async (id, timeout = 3000) => helpers.element.custom(By.className(className), timeout),
			xpath : async (xpath, timeout = 3000) => helpers.element.custom(By.xpath(xpath), timeout)
		},

		// Load a page
		loading: async customURL =>
			await driver.get(`http://localhost:3000/${customURL ?? url}`),

		// Sleep for a while
		sleep: (milliseconds) =>
			new Promise(resolve => setTimeout(resolve, milliseconds)),

		// Simple checks
		common: {
			pageTitle: async () =>
				await (await helpers.element.css(".css-0 > div:first-child")).getText()

		}
	}

	// Run the tests
	describe(name, () => {

		// Allow more time for tests
		jest.setTimeout(config.timeout)

		// Prepare
		beforeAll(async () => {

			// Make sure the user is logged in
			if (login) {
				await helpers.loading("login")
				;(await helpers.element.css("input[type='text']")).sendKeys(config.login.user)
				;(await helpers.element.css("input[type=password]")).sendKeys(config.login.pass)
				;(await helpers.element.css("button[type=submit]")).click()

				// Give some time before going to the actual tests
				await helpers.sleep(config.login.sleep)
			}

		}, config.timeout)

		// Run the tests
		tests(helpers)
	})
}

export default seleniumTest
