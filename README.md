# VK Forms Backend

## Overview
This project is a backend API for an online form builder, designed to help users create and manage forms, surveys, and questionnaires efficiently. Leveraging modern technologies, it ensures high performance and reliability.
## Features
* **VK Mini App Authentication:** secure user registration through VK Mini App signature verification.
* **High Performance:** built with Bun and Hono framework, offering fast response times.
* **Rate Limiting:** limit the number of requests per minute using Redis.
## Technologies
* **Bun:** The runtime environment.
* **Hono:** The web framework.
* **Redis:** Used for rate limiting.
* **PostgreSQL:** The database system.
* **Prisma:** The ORM for database management.
## Installation
To get started with this project, follow these steps:

1. **Clone the repository:**
	```
	git clone https://github.com/jw-42/vk-forms-backend.git
	cd vk-forms-backend
	```
2. **Install dependencies:**
	```
	bun install
	```
3. **Configure environment variables:**
	Create a '*.env.production*' and '*.env.development*' files and add the necessary configuration:
	```
	PORT=3000
	APP_SECRET="Your_secret_key_from_VK_Mini_App"
	ACCESS_TOKEN_SECRET="String_for_token_generation"
	DB_URL="postgresql://LOGIN:PASSWORD@HOST:POST/DB_NAME"
	RATE_LIMIT_PER_MINUTE=60
	```
4. **Rin migrations:**
	```
	bunx prisma migrate dev --name init
	```
5. **Start the server:**
	```
	bun run dev
	```
## Usage
### VK Mini App Authentication
To authenticate users, the API validates the VK Mini App signature parameters. Ensure your VK application is active and correctly configured.
## Contributing
We welcome contributions! Please follow these steps to contribute:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a Pull Request.
## License
This project is licensed under the MIT License.
## Contact
For any questions or feedback, please reach out to *v.laukman@mail.ru* or open an issue on GitHub.