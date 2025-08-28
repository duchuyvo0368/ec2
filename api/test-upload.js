const { MongoClient } = require('mongodb');

async function seedUsers() {
  const uri = 'mongodb://localhost:27017';
  const client = new MongoClient(uri);

  const firstNames = [
    'Linh', 'Nam', 'Huy', 'Trang', 'Thảo', 'Minh', 'Dũng', 'Hiếu',
    'Lan', 'Hà', 'Phương', 'Ngọc', 'Hương', 'Tuấn', 'Anh', 'Khoa',
    'Châu', 'Quân', 'Mai', 'Bình', 'Quỳnh', 'Trung', 'Tiến', 'Vân',
  ];

  const lastNames = [
    'Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Vũ', 'Đặng', 'Bùi',
    'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý', 'Tô', 'Đinh', 'Trịnh',
  ];

  function getRandomName() {
    const first = firstNames[Math.floor(Math.random() * firstNames.length)];
    const last = lastNames[Math.floor(Math.random() * lastNames.length)];
    return `${last} ${first}`;
  }

  try {
    await client.connect();
    const db = client.db('users_dev');
    const usersCollection = db.collection('Users');

    const users = [];

    for (let i = 1; i <= 50; i++) {
      const name = getRandomName();
      users.push({
        email: `user${i}@example.com`,
        name,
        avatar: `https://i.pravatar.cc/150?img=${i % 70}`,
        password: '123456',
        bio: `Xin chào, tôi là ${name}`,
      });
    }

    const result = await usersCollection.insertMany(users);
    console.log(`✅ Đã thêm ${result.insertedCount} users vào MongoDB`);
  } catch (err) {
    console.error('❌ Lỗi khi seed:', err);
  } finally {
    await client.close();
  }
}

seedUsers();


// seedUsers();
// const { MongoClient } = require('mongodb');

// async function updateAvatars() {
//   const uri = 'mongodb://localhost:27017';
//   const client = new MongoClient(uri);

//   try {
//     await client.connect();
//     const db = client.db('users_dev');
//     const usersCollection = db.collection('Users');

//     // Tìm các user có email từ user50@example.com đến user10000@example.com
//     const regex = /^user(\d+)@example\.com$/;
//     const cursor = usersCollection.find({
//       email: { $regex: regex }
//     });

//     let count = 0;

//     while (await cursor.hasNext()) {
//       const user = await cursor.next();

//       // Lấy số thứ tự từ email (ví dụ: user59@example.com => 59)
//       const match = user.email.match(regex);
//       if (!match) continue;

//       const index = parseInt(match[1]);
//       if (index < 50 || index > 100000) continue;

//       const newAvatar = `https://file.apetavers.com/api/files/admin/20241228/2c40e35d-58c2-4d1b-a23a-b1147900aa4a--150.png`;

//       await usersCollection.updateOne(
//         { _id: user._id },
//         { $set: { avatar: newAvatar } }
//       );

//       count++;
//       if (count % 1000 === 0) console.log(`Đã cập nhật ${count} users`);
//     }

//     console.log(`✅ Đã cập nhật avatar cho ${count} users (user50 → user10000)`);
//   } catch (err) {
//     console.error('❌ Lỗi khi cập nhật avatar:', err);
//   } finally {
//     await client.close();
//   }
// }

// updateAvatars();

// const { MongoClient } = require('mongodb');

// async function deleteUsers() {
//   const uri = 'mongodb://localhost:27017';
//   const client = new MongoClient(uri);

//   try {
//     await client.connect();
//     const db = client.db('users_dev');
//     const usersCollection = db.collection('Users');

//     const regex = /^user(\d+)@example\.com$/;

//     const cursor = usersCollection.find({ email: { $regex: regex } });

//     let deleteCount = 0;

//     while (await cursor.hasNext()) {
//       const user = await cursor.next();

//       const match = user.email.match(regex);
//       if (!match) continue;

//       const index = parseInt(match[1]);
//       if (index <= 10000 || index > 100000) continue;

//       await usersCollection.deleteOne({ _id: user._id });
//       deleteCount++;

//       if (deleteCount % 1000 === 0) {
//         console.log(`Đã xóa ${deleteCount} users`);
//       }
//     }

//     console.log(`✅ Đã xóa ${deleteCount} users (user10001 → user100000)`);
//   } catch (err) {
//     console.error('❌ Lỗi khi xóa users:', err);
//   } finally {
//     await client.close();
//   }
// }

// deleteUsers();



// import mongoose from 'mongoose';
// import { UserSchema } from '../src/schemas/user.schema';
// import { FriendRelationSchema } from '../src/schemas/friend-relation.schema';

// const MONGO_URI = 'mongodb://localhost:27017/users_dev'; // 🔧 chỉnh tên DB
// const FROM_USER_ID = new mongoose.Types.ObjectId('687f034db77a2b9bca29c7d5'); // 👈 user đã có sẵn

// const firstNames = [
//   'Linh',
//   'Nam',
//   'Huy',
//   'Trang',
//   'Thảo',
//   'Minh',
//   'Dũng',
//   'Hiếu',
//   'Lan',
//   'Hà',
//   'Phương',
//   'Ngọc',
//   'Hương',
//   'Tuấn',
//   'Anh',
//   'Khoa',
//   'Châu',
//   'Quân',
//   'Mai',
//   'Bình',
//   'Quỳnh',
//   'Trung',
//   'Tiến',
//   'Vân',
// ];

// const lastNames = [
//   'Nguyễn',
//   'Trần',
//   'Lê',
//   'Phạm',
//   'Hoàng',
//   'Vũ',
//   'Đặng',
//   'Bùi',
//   'Đỗ',
//   'Hồ',
//   'Ngô',
//   'Dương',
//   'Lý',
//   'Tô',
//   'Đinh',
//   'Trịnh',
// ];

// function getRandomName() {
//   const first = firstNames[Math.floor(Math.random() * firstNames.length)];
//   const last = lastNames[Math.floor(Math.random() * lastNames.length)];
//   return `${last} ${first}`;
// }

// const run = async () => {
//   await mongoose.connect(MONGO_URI);

//   const UserModel = mongoose.model('Users', UserSchema);
//   const FriendRelationModel = mongoose.model(
//     'FriendRelation',
//     FriendRelationSchema,
//   );

//   const users = [];

//   // 1. Tạo danh sách 20 user
//   for (let i = 1; i <= 2000; i++) {
//     const name = getRandomName();
//     users.push({
//       email: `user_fake_${Date.now()}_${i}@example.com`,
//       name,
//       avatar: `https://i.pravatar.cc/150?img=${i % 70}`,
//       password: '123456', // 🔐 giả định đã hash
//       bio: `Xin chào, tôi là ${name}`,
//     });
//   }

//   const createdUsers = await UserModel.insertMany(users);
//   console.log(`✅ Đã thêm ${createdUsers.length} users`);

//   // 2. Tạo quan hệ bạn bè từ FROM_USER_ID → mỗi user mới tạo
//   const relations = createdUsers.map((user) => ({
//     fromUser: FROM_USER_ID,
//     toUser: user._id,
//     type: 'accepted',
//     acceptedAt: new Date(),
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   }));

//   const result = await FriendRelationModel.insertMany(relations);
//   console.log(`✅ Đã tạo ${result.length} mối quan hệ bạn bè`);

//   await mongoose.disconnect();
// };

// run().catch(console.error);
