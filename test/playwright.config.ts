import type { PlaywrightTestConfig } from '@playwright/test'

const config: PlaywrightTestConfig = {
	webServer: {
		command: 'while true; do sleep 600; done',
		url: 'http://api/health',
		reuseExistingServer: true
	},
	use: {
		baseURL: 'http://ui',
		trace: 'retain-on-failure',
	},
	testDir: 'tests',
	testMatch: /(.+\.)?(test|spec)\.[jt]s/
};

export default config
