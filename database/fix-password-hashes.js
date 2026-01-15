// Fix Password Hashes for Existing Users
const { DatabaseConnection } = require('./database-connection.js');
const bcrypt = require('bcryptjs');

// Sample users with correct passwords
const sampleUsers = [
    { username: 'admin', password: 'admin123' },
    { username: 'johndoe', password: 'password123' },
    { username: 'sarahsmith', password: 'secure456' },
    { username: 'mohammedali', password: 'dubai789' },
    { username: 'fatimahassan', password: 'uae321' },
    { username: 'ahmedkhalid', password: 'khalid654' },
    { username: 'mariamal', password: 'mariam987' },
    { username: 'omarsaeed', password: 'omar111' },
    { username: 'testuser', password: 'test123' }
];

async function fixPasswordHashes() {
    const db = new DatabaseConnection();

    try {
        console.log('Starting password hash fixes...');

        for (const user of sampleUsers) {
            // Hash the password with correct parameters (10 rounds)
            const hashedPassword = await bcrypt.hash(user.password, 10);

            // Update the password hash in database
            await db.executeQuery(
                'UPDATE Users SET password_hash = ? WHERE username = ?',
                [hashedPassword, user.username]
            );

            console.log(`Fixed password hash for user: ${user.username}`);
        }

        console.log('Password hash fixes completed successfully!');

    } catch (error) {
        console.error('Error fixing password hashes:', error);
    }
}

// Execute the function if this script is run directly
if (require.main === module) {
    fixPasswordHashes().then(() => {
        process.exit(0);
    }).catch(error => {
        console.error(error);
        process.exit(1);
    });
}

module.exports = { fixPasswordHashes };