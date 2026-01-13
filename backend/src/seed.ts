import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SettingsService } from './modules/settings/settings.service';
import { InventoryService } from './modules/inventory/inventory.service';
import { CustomersService } from './modules/customers/customers.service';
import { SalesService } from './modules/sales/sales.service';

// Toyota spare parts data
const TOYOTA_PARTS = [
    // Engine Parts
    { name: 'Oil Filter', category: 'Engine Parts', basePrice: 450, gstRate: 18, unit: 'pcs' },
    { name: 'Air Filter', category: 'Engine Parts', basePrice: 650, gstRate: 18, unit: 'pcs' },
    { name: 'Fuel Filter', category: 'Engine Parts', basePrice: 550, gstRate: 18, unit: 'pcs' },
    { name: 'Spark Plug Set', category: 'Engine Parts', basePrice: 1200, gstRate: 18, unit: 'set' },
    { name: 'Timing Belt', category: 'Engine Parts', basePrice: 2500, gstRate: 18, unit: 'pcs' },
    { name: 'Water Pump', category: 'Engine Parts', basePrice: 3500, gstRate: 18, unit: 'pcs' },
    { name: 'Radiator', category: 'Engine Parts', basePrice: 8500, gstRate: 18, unit: 'pcs' },
    { name: 'Thermostat', category: 'Engine Parts', basePrice: 850, gstRate: 18, unit: 'pcs' },
    { name: 'Engine Mount', category: 'Engine Parts', basePrice: 1800, gstRate: 18, unit: 'pcs' },
    { name: 'Cylinder Head Gasket', category: 'Engine Parts', basePrice: 2200, gstRate: 18, unit: 'pcs' },

    // Brake System
    { name: 'Front Brake Pads', category: 'Brake System', basePrice: 1800, gstRate: 18, unit: 'set' },
    { name: 'Rear Brake Pads', category: 'Brake System', basePrice: 1600, gstRate: 18, unit: 'set' },
    { name: 'Brake Disc Front', category: 'Brake System', basePrice: 3200, gstRate: 18, unit: 'pcs' },
    { name: 'Brake Disc Rear', category: 'Brake System', basePrice: 2800, gstRate: 18, unit: 'pcs' },
    { name: 'Brake Fluid DOT 4', category: 'Brake System', basePrice: 350, gstRate: 18, unit: 'ltr' },
    { name: 'Brake Master Cylinder', category: 'Brake System', basePrice: 4500, gstRate: 18, unit: 'pcs' },
    { name: 'Brake Caliper', category: 'Brake System', basePrice: 5500, gstRate: 18, unit: 'pcs' },
    { name: 'Handbrake Cable', category: 'Brake System', basePrice: 1200, gstRate: 18, unit: 'pcs' },

    // Suspension
    { name: 'Front Shock Absorber', category: 'Suspension', basePrice: 3500, gstRate: 18, unit: 'pcs' },
    { name: 'Rear Shock Absorber', category: 'Suspension', basePrice: 3200, gstRate: 18, unit: 'pcs' },
    { name: 'Strut Mount', category: 'Suspension', basePrice: 1500, gstRate: 18, unit: 'pcs' },
    { name: 'Control Arm Bushing', category: 'Suspension', basePrice: 800, gstRate: 18, unit: 'pcs' },
    { name: 'Stabilizer Link', category: 'Suspension', basePrice: 650, gstRate: 18, unit: 'pcs' },
    { name: 'Ball Joint', category: 'Suspension', basePrice: 1200, gstRate: 18, unit: 'pcs' },

    // Electrical
    { name: 'Battery 12V 65Ah', category: 'Electrical', basePrice: 5500, gstRate: 18, unit: 'pcs' },
    { name: 'Alternator', category: 'Electrical', basePrice: 8500, gstRate: 18, unit: 'pcs' },
    { name: 'Starter Motor', category: 'Electrical', basePrice: 7500, gstRate: 18, unit: 'pcs' },
    { name: 'Headlight Assembly', category: 'Electrical', basePrice: 4500, gstRate: 18, unit: 'pcs' },
    { name: 'Tail Light Assembly', category: 'Electrical', basePrice: 2800, gstRate: 18, unit: 'pcs' },
    { name: 'Fog Light', category: 'Electrical', basePrice: 1800, gstRate: 18, unit: 'pcs' },
    { name: 'Horn', category: 'Electrical', basePrice: 450, gstRate: 18, unit: 'pcs' },
    { name: 'Wiper Blade Set', category: 'Electrical', basePrice: 650, gstRate: 18, unit: 'set' },

    // Body Parts
    { name: 'Front Bumper', category: 'Body Parts', basePrice: 8500, gstRate: 18, unit: 'pcs' },
    { name: 'Rear Bumper', category: 'Body Parts', basePrice: 7500, gstRate: 18, unit: 'pcs' },
    { name: 'Side Mirror', category: 'Body Parts', basePrice: 2500, gstRate: 18, unit: 'pcs' },
    { name: 'Door Handle', category: 'Body Parts', basePrice: 850, gstRate: 18, unit: 'pcs' },
    { name: 'Hood', category: 'Body Parts', basePrice: 12000, gstRate: 18, unit: 'pcs' },
    { name: 'Fender', category: 'Body Parts', basePrice: 6500, gstRate: 18, unit: 'pcs' },
    { name: 'Grille', category: 'Body Parts', basePrice: 3500, gstRate: 18, unit: 'pcs' },

    // Transmission
    { name: 'Clutch Kit', category: 'Transmission', basePrice: 8500, gstRate: 18, unit: 'set' },
    { name: 'Transmission Oil', category: 'Transmission', basePrice: 1200, gstRate: 18, unit: 'ltr' },
    { name: 'Clutch Cable', category: 'Transmission', basePrice: 650, gstRate: 18, unit: 'pcs' },
    { name: 'Gear Shift Cable', category: 'Transmission', basePrice: 1500, gstRate: 18, unit: 'pcs' },

    // Cooling System
    { name: 'Coolant 5L', category: 'Cooling System', basePrice: 850, gstRate: 18, unit: 'can' },
    { name: 'Radiator Hose', category: 'Cooling System', basePrice: 650, gstRate: 18, unit: 'pcs' },
    { name: 'Radiator Cap', category: 'Cooling System', basePrice: 250, gstRate: 18, unit: 'pcs' },
    { name: 'Cooling Fan', category: 'Cooling System', basePrice: 3500, gstRate: 18, unit: 'pcs' },

    // Exhaust System
    { name: 'Exhaust Manifold', category: 'Exhaust System', basePrice: 5500, gstRate: 18, unit: 'pcs' },
    { name: 'Catalytic Converter', category: 'Exhaust System', basePrice: 15000, gstRate: 18, unit: 'pcs' },
    { name: 'Muffler', category: 'Exhaust System', basePrice: 4500, gstRate: 18, unit: 'pcs' },
    { name: 'Exhaust Pipe', category: 'Exhaust System', basePrice: 2500, gstRate: 18, unit: 'pcs' },
];

const INDIAN_CITIES = [
    { city: 'Mumbai', state: 'Maharashtra' },
    { city: 'Delhi', state: 'Delhi' },
    { city: 'Bangalore', state: 'Karnataka' },
    { city: 'Hyderabad', state: 'Telangana' },
    { city: 'Chennai', state: 'Tamil Nadu' },
    { city: 'Pune', state: 'Maharashtra' },
    { city: 'Ahmedabad', state: 'Gujarat' },
    { city: 'Kolkata', state: 'West Bengal' },
    { city: 'Jaipur', state: 'Rajasthan' },
    { city: 'Lucknow', state: 'Uttar Pradesh' },
];

const CUSTOMER_NAMES = [
    'Rajesh Motors', 'Kumar Auto Parts', 'Singh Garage', 'Sharma Auto Service',
    'Patel Motors', 'Gupta Auto Works', 'Reddy Auto Care', 'Mehta Garage',
    'Verma Auto Center', 'Khan Motors', 'Joshi Auto Parts', 'Rao Service Station',
    'Desai Motors', 'Agarwal Auto', 'Iyer Auto Service', 'Nair Garage',
    'Chopra Motors', 'Malhotra Auto', 'Bansal Service Center', 'Saxena Motors',
    'Trivedi Auto Parts', 'Pandey Garage', 'Mishra Motors', 'Tiwari Auto',
    'Sinha Service Station', 'Jain Motors', 'Shah Auto Works', 'Kapoor Garage',
    'Bhatia Auto Center', 'Sethi Motors', 'Arora Auto Parts', 'Khanna Service',
    'Bajaj Motors', 'Mittal Auto', 'Goyal Garage', 'Singhal Auto Service',
    'Ahluwalia Motors', 'Chawla Auto', 'Dhawan Service Center', 'Bedi Motors',
    'Kohli Auto Parts', 'Anand Garage', 'Bhatt Motors', 'Doshi Auto',
    'Gandhi Service Station', 'Hegde Motors', 'Kulkarni Auto Works', 'Naik Garage',
    'Pawar Auto Center', 'Rane Motors', 'Shetty Auto Parts', 'Thakur Service',
];

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);

    const settingsService = app.get(SettingsService);
    const inventoryService = app.get(InventoryService);
    const customersService = app.get(CustomersService);
    const salesService = app.get(SalesService);

    console.log('🌱 Starting database seeding...\n');

    try {
        // 1. Create categories
        console.log('📁 Creating categories...');
        const categories = ['Engine Parts', 'Brake System', 'Suspension', 'Electrical', 'Body Parts', 'Transmission', 'Cooling System', 'Exhaust System'];
        const categoryMap = new Map();

        for (const catName of categories) {
            const category = await settingsService.createCategory({ name: catName });
            categoryMap.set(catName, (category as any)._id.toString());
            console.log(`  ✓ Created category: ${catName}`);
        }

        // 2. Create products
        console.log('\n📦 Creating products...');
        const products = [];
        for (const part of TOYOTA_PARTS) {
            const categoryId = categoryMap.get(part.category);
            const sku = `TOY-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
            const quantity = Math.floor(Math.random() * 100) + 10;
            const reorderPoint = Math.floor(Math.random() * 20) + 5;

            const product = await inventoryService.create({
                name: part.name,
                sku,
                description: `Genuine Toyota ${part.name} - OEM Quality`,
                categoryId,
                purchasePrice: part.basePrice * 0.7,
                price: part.basePrice,
                quantity,
                reorderPoint,
                unit: part.unit,
                hsnCode: `8708${Math.floor(Math.random() * 90) + 10}`,
                gstRate: part.gstRate,
            });
            products.push(product);
            console.log(`  ✓ Created product: ${part.name} (${sku})`);
        }

        // 3. Create customers
        console.log('\n👥 Creating customers...');
        const customers = [];
        for (let i = 0; i < CUSTOMER_NAMES.length; i++) {
            const location = INDIAN_CITIES[i % INDIAN_CITIES.length];
            const hasGST = Math.random() > 0.3;

            const customer = await customersService.create({
                name: CUSTOMER_NAMES[i],
                phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
                email: `${CUSTOMER_NAMES[i].toLowerCase().replace(/\s+/g, '')}@example.com`,
                address: `${Math.floor(Math.random() * 500) + 1}, ${location.city}`,
                state: location.state,
                gstin: hasGST ? `27${Math.random().toString(36).substring(2, 15).toUpperCase()}` : '',
            });
            customers.push(customer);
            console.log(`  ✓ Created customer: ${CUSTOMER_NAMES[i]}`);
        }

        // 4. Create sales
        console.log('\n💰 Creating sales transactions...');
        for (let i = 0; i < 50; i++) {
            const customer = customers[Math.floor(Math.random() * customers.length)];
            const itemCount = Math.floor(Math.random() * 5) + 1;
            const items = [];

            for (let j = 0; j < itemCount; j++) {
                const product = products[Math.floor(Math.random() * products.length)];
                const quantity = Math.floor(Math.random() * 5) + 1;

                items.push({
                    productId: (product as any)._id.toString(),
                    name: product.name,
                    quantity,
                    price: product.price,
                });
            }

            const paymentStatus = Math.random() > 0.3 ? 'PAID' : 'PENDING';
            const paymentMethod = ['CASH', 'CARD', 'TRANSFER', 'CREDIT'][Math.floor(Math.random() * 4)];

            const sale = await salesService.create({
                customerId: (customer as any)._id.toString(),
                items,
                paymentStatus,
                paymentMethod,
                notes: `Sale #${i + 1} - Toyota spare parts`,
            });

            console.log(`  ✓ Created sale: ${(sale as any).invoiceNumber} for ${customer.name}`);
        }

        console.log('\n✅ Database seeding completed successfully!');
        console.log(`\n📊 Summary:`);
        console.log(`  - Categories: ${categories.length}`);
        console.log(`  - Products: ${products.length}`);
        console.log(`  - Customers: ${customers.length}`);
        console.log(`  - Sales: 50`);

    } catch (error) {
        console.error('❌ Error seeding database:', error);
    } finally {
        await app.close();
    }
}

bootstrap();
