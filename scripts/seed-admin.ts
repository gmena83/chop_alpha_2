import { db } from '../src/db';
import { users } from '../src/db/schema';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

async function seedAdmin() {
  const email = 'ryan.warren@aimsinnovations.com';
  const password = 'ETA@Admin2024!';
  const name = 'Ryan Warren';
  
  const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
  
  if (existingUser.length > 0) {
    console.log('Admin user already exists, updating role to super_admin...');
    await db.update(users)
      .set({ 
        role: 'super_admin',
        name: name,
        updatedAt: new Date()
      })
      .where(eq(users.email, email));
    console.log('Admin user updated successfully!');
  } else {
    const hashedPassword = await bcrypt.hash(password, 12);
    
    await db.insert(users).values({
      email,
      name,
      password: hashedPassword,
      role: 'super_admin',
      localePreference: 'en',
      emailVerified: new Date(),
    });
    
    console.log('Admin user created successfully!');
  }
  
  console.log('\nAdmin credentials:');
  console.log('Email:', email);
  console.log('Password:', password);
  console.log('\nPlease change this password after first login!');
  
  process.exit(0);
}

seedAdmin().catch((error) => {
  console.error('Failed to seed admin:', error);
  process.exit(1);
});
