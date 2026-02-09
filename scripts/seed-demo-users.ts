import { db } from '../src/db';
import { users } from '../src/db/schema';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

async function seedDemoUsers() {
    const usersToSeed = [
        {
            email: 'staff@demo.com',
            password: 'DemoPass123!',
            name: 'Demo Staff',
            role: 'professional' as const,
        },
        {
            email: 'teen@demo.com',
            password: 'DemoPass123!',
            name: 'Demo Teen',
            role: 'teen' as const,
        },
        {
            email: 'parent@demo.com',
            password: 'DemoPass123!',
            name: 'Demo Parent',
            role: 'parent' as const,
        },
        {
            email: 'ryan.warren@aimsinnovations.com',
            password: 'ETA@Admin2024!',
            name: 'Ryan Warren',
            role: 'super_admin' as const,
        }
    ];

    console.log('Seeding demo users...');

    for (const user of usersToSeed) {
        const existingUser = await db.select().from(users).where(eq(users.email, user.email)).limit(1);

        if (existingUser.length > 0) {
            console.log(`User ${user.email} already exists. Updating...`);
            // Optional: Update password if needed, but for now we just ensure they exist
            if (user.role === 'super_admin') {
                await db.update(users).set({ role: 'super_admin' }).where(eq(users.email, user.email));
            }
        } else {
            console.log(`Creating user ${user.email}...`);
            const hashedPassword = await bcrypt.hash(user.password, 12);
            await db.insert(users).values({
                email: user.email,
                name: user.name,
                password: hashedPassword,
                role: user.role,
                localePreference: 'en',
                emailVerified: new Date(),
            });
        }
    }

    console.log('Demo users seeded successfully!');
    process.exit(0);
}

seedDemoUsers().catch((error) => {
    console.error('Failed to seed demo users:', error);
    process.exit(1);
});
