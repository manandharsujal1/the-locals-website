import bcrypt from "bcryptjs";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question(
  "Enter your new admin password: ",
  async (password) => {
    if (!password || password.length < 8) {
      console.log(
        "Password must contain at least 8 characters."
      );

      rl.close();
      return;
    }

    const hash = await bcrypt.hash(
      password,
      12
    );

    console.log("\nPassword hash:\n");
    console.log(hash);

    console.log(
      "\nCopy this value into ADMIN_PASSWORD_HASH in your .env file."
    );

    rl.close();
  }
);