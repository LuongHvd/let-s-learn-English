export interface DialogueLine {
  id: string;
  speaker: string;
  avatar: string;
  text: string;
  vi: string;
}

export interface DialogueItem {
  id: string;
  titleEn: string;
  titleVi: string;
  category: string;
  icon: string;
  level: 'Cơ bản' | 'Trung bình';
  lines: DialogueLine[];
}

export const DIALOGUES: DialogueItem[] = [
  // 1
  {
    id: 'd_01_hello',
    titleEn: 'Saying Hello & Making Friends',
    titleVi: 'Chào hỏi & Làm quen bạn mới',
    category: 'Giao tiếp hàng ngày',
    icon: '👋',
    level: 'Cơ bản',
    lines: [
      { id: '1', speaker: 'Tom', avatar: '👦', text: 'Hello! Good morning! What is your name?', vi: 'Xin chào! Chào buổi sáng! Tên của bạn là gì thế?' },
      { id: '2', speaker: 'Anna', avatar: '👧', text: 'Hi! My name is Anna. Nice to meet you!', vi: 'Chào bạn! Tên mình là Anna. Rất vui được gặp bạn!' },
      { id: '3', speaker: 'Tom', avatar: '👦', text: 'I am Tom. How are you today, Anna?', vi: 'Mình là Tom. Hôm nay bạn thế nào, Anna?' },
      { id: '4', speaker: 'Anna', avatar: '👧', text: 'I am very happy and great, thank you!', vi: 'Mình rất vui và tràn đầy năng lượng, cảm ơn bạn nhé!' },
    ],
  },

  // 2
  {
    id: 'd_02_age',
    titleEn: 'How Old Are You?',
    titleVi: 'Hỏi tuổi và sinh nhật',
    category: 'Giao tiếp hàng ngày',
    icon: '🎂',
    level: 'Cơ bản',
    lines: [
      { id: '1', speaker: 'Teacher Lily', avatar: '🧑‍🏫', text: 'Hello Leo! How old are you?', vi: 'Chào Leo! Em năm nay bao nhiêu tuổi rồi?' },
      { id: '2', speaker: 'Leo', avatar: '👦', text: 'I am seven years old, teacher!', vi: 'Dạ em bảy tuổi rồi thưa cô giáo!' },
      { id: '3', speaker: 'Teacher Lily', avatar: '🧑‍🏫', text: 'When is your birthday, Leo?', vi: 'Thế khi nào là đến ngày sinh nhật của em?' },
      { id: '4', speaker: 'Leo', avatar: '👦', text: 'My birthday is next month. We will have a big cake!', vi: 'Sinh nhật của em vào tháng sau. Cả nhà sẽ có bánh kem to lắm ạ!' },
    ],
  },

  // 3
  {
    id: 'd_03_colors',
    titleEn: 'Favorite Colors & Painting',
    titleVi: 'Màu sắc yêu thích & Vẽ tranh',
    category: 'Sở thích & Vui chơi',
    icon: '🎨',
    level: 'Cơ bản',
    lines: [
      { id: '1', speaker: 'Mia', avatar: '👧', text: 'Look at my picture! What color do you like?', vi: 'Hãy nhìn bức tranh của tớ này! Cậu thích màu sắc nào?' },
      { id: '2', speaker: 'Ben', avatar: '👦', text: 'I like blue and green! The blue sky and green tree look beautiful.', vi: 'Tớ thích màu xanh da trời và xanh lá! Bầu trời xanh và cái cây xanh trông thật đẹp.' },
      { id: '3', speaker: 'Mia', avatar: '👧', text: 'I love bright pink and yellow. Can you pass me the pencil?', vi: 'Tớ lại yêu màu hồng và màu vàng rực rỡ. Cậu đưa cho tớ cây bút chì với nhé?' },
      { id: '4', speaker: 'Ben', avatar: '👦', text: 'Here you are! Let us draw a big colorful rainbow together.', vi: 'Của cậu đây! Chúng mình cùng nhau vẽ một chiếc cầu vồng thật to nào.' },
    ],
  },

  // 4
  {
    id: 'd_04_animals',
    titleEn: 'At the Happy Zoo',
    titleVi: 'Thăm sở thú vui vẻ',
    category: 'Thế giới động vật',
    icon: '🦁',
    level: 'Cơ bản',
    lines: [
      { id: '1', speaker: 'Sam', avatar: '👦', text: 'Look over there! Is that a big elephant?', vi: 'Nhìn đằng kia kìa! Đó có phải là một chú voi to lớn không?' },
      { id: '2', speaker: 'Emma', avatar: '👧', text: 'Yes, it is! Look at its long nose and big ears!', vi: 'Đúng rồi đó! Nhìn cái vòi dài và đôi tai to của chú voi kìa!' },
      { id: '3', speaker: 'Sam', avatar: '👦', text: 'And look at the cute monkey eating a yellow banana!', vi: 'Và nhìn chú khỉ con dễ thương đang ăn quả chuối vàng kia nữa!' },
      { id: '4', speaker: 'Emma', avatar: '👧', text: 'Haha, the funny monkey can jump high from tree to tree.', vi: 'Haha, chú khỉ vui nhộn có thể nhảy thoăn thoắt từ cây này sang cây khác.' },
    ],
  },

  // 5
  {
    id: 'd_05_fruits',
    titleEn: 'Fruit Market Adventure',
    titleVi: 'Đi chợ mua trái cây',
    category: 'Món ăn & Đồ uống',
    icon: '🍎',
    level: 'Cơ bản',
    lines: [
      { id: '1', speaker: 'Mom', avatar: '👩', text: 'What fruits do you want to buy for our picnic?', vi: 'Con muốn mua loại trái cây nào cho chuyến dã ngoại của nhà mình?' },
      { id: '2', speaker: 'Toby', avatar: '👦', text: 'Mom, can we buy sweet red apples and juicy strawberries?', vi: 'Mẹ ơi, chúng ta mua những quả táo đỏ ngọt và dâu tây mọng nước được không ạ?' },
      { id: '3', speaker: 'Mom', avatar: '👩', text: 'Sure! Let us also pick a big green watermelon.', vi: 'Chắc chắn rồi! Mẹ con mình cùng chọn thêm một quả dưa hấu to xanh mát nữa nhé.' },
      { id: '4', speaker: 'Toby', avatar: '👦', text: 'Hooray! Fresh fruit gives us energy to play and run!', vi: 'Tuyệt vời quá! Trái cây tươi cho chúng ta nhiều năng lượng để chạy nhảy vui chơi!' },
    ],
  },

  // 6
  {
    id: 'd_06_morning',
    titleEn: 'Good Morning, Wake Up!',
    titleVi: 'Chào buổi sáng, Thức dậy nào!',
    category: 'Thói quen hàng ngày',
    icon: '☀️',
    level: 'Cơ bản',
    lines: [
      { id: '1', speaker: 'Dad', avatar: '👨', text: 'Good morning, sweetie! The warm sun is up.', vi: 'Chào buổi sáng con yêu! Ông mặt trời ấm áp đã lên cao rồi.' },
      { id: '2', speaker: 'Lily', avatar: '👧', text: 'Good morning, Dad! I feel so energetic today.', vi: 'Chào buổi sáng bố! Hôm nay con cảm thấy rất khỏe khoắn và vui vẻ.' },
      { id: '3', speaker: 'Dad', avatar: '👨', text: 'Please wash your face and brush your teeth.', vi: 'Con hãy rửa mặt và đánh răng sạch sẽ nhé.' },
      { id: '4', speaker: 'Lily', avatar: '👧', text: 'Yes, Dad! And then we drink fresh warm milk for breakfast!', vi: 'Vâng ạ! Sau đó bố con mình cùng uống sữa ấm cho bữa sáng bố nhé!' },
    ],
  },

  // 7
  {
    id: 'd_07_ice_cream',
    titleEn: 'Ordering an Ice Cream',
    titleVi: 'Chọn món kem thơm ngon',
    category: 'Món ăn & Đồ uống',
    icon: '🍦',
    level: 'Cơ bản',
    lines: [
      { id: '1', speaker: 'Ice Cream Maker', avatar: '🧑‍🍳', text: 'Hello young friend! What ice cream flavor do you like?', vi: 'Xin chào bạn nhỏ! Cháu thích hương vị kem nào?' },
      { id: '2', speaker: 'Lucas', avatar: '👦', text: 'Hello! I want a chocolate and vanilla ice cream, please.', vi: 'Cháu chào chú! Cho cháu một que kem sô-cô-la và vani ạ.' },
      { id: '3', speaker: 'Ice Cream Maker', avatar: '🧑‍🍳', text: 'Would you like sweet strawberries on top?', vi: 'Cháu có muốn rắc thêm những lát dâu tây ngọt ngào lên trên không?' },
      { id: '4', speaker: 'Lucas', avatar: '👦', text: 'Yes, please! Thank you so much, it looks delicious!', vi: 'Dạ có ạ! Cháu cảm ơn chú nhiều, trông ngon tuyệt cú mèo!' },
    ],
  },

  // 8
  {
    id: 'd_08_playground',
    titleEn: 'Fun at the Playground',
    titleVi: 'Vui chơi ở sân trường',
    category: 'Sở thích & Vui chơi',
    icon: '⚽',
    level: 'Cơ bản',
    lines: [
      { id: '1', speaker: 'Max', avatar: '👦', text: 'Recess time! Do you want to kick the soccer ball with me?', vi: 'Đến giờ ra chơi rồi! Cậu có muốn cùng đá bóng với tớ không?' },
      { id: '2', speaker: 'Zoe', avatar: '👧', text: 'Yes, let us run to the green grass field!', vi: 'Có chứ, chúng mình cùng chạy ra sân cỏ xanh kia đi!' },
      { id: '3', speaker: 'Max', avatar: '👦', text: 'Pass the ball to me! Kick it high!', vi: 'Chuyền bóng cho tớ nào! Sút bổng lên thật cao nhé!' },
      { id: '4', speaker: 'Zoe', avatar: '👧', text: 'Goal! Playing sports with friends is so much fun.', vi: 'Vào rồi! Chơi thể thao cùng bạn bè thật là thích!' },
    ],
  },

  // 9
  {
    id: 'd_09_classroom',
    titleEn: 'In the English Classroom',
    titleVi: 'Trong lớp học tiếng Anh',
    category: 'Trường học',
    icon: '✏️',
    level: 'Cơ bản',
    lines: [
      { id: '1', speaker: 'Teacher Dan', avatar: '🧑‍🏫', text: 'Good morning class! Please take out your English book.', vi: 'Chào buổi sáng cả lớp! Các em hãy lấy sách tiếng Anh ra nào.' },
      { id: '2', speaker: 'Student Maya', avatar: '👧', text: 'Teacher, what page are we reading today?', vi: 'Thưa thầy, hôm nay chúng em đọc trang số mấy ạ?' },
      { id: '3', speaker: 'Teacher Dan', avatar: '🧑‍🏫', text: 'Open page ten. We will learn new words about family and animals.', vi: 'Hãy mở trang số mười nhé. Chúng ta sẽ học những từ mới về gia đình và loài vật.' },
      { id: '4', speaker: 'Student Maya', avatar: '👧', text: 'Great! I love learning new English words every day.', vi: 'Tuyệt quá ạ! Em rất yêu thích học thêm nhiều từ vựng tiếng Anh mỗi ngày.' },
    ],
  },

  // 10
  {
    id: 'd_10_pet_dog',
    titleEn: 'My Cute Little Puppy',
    titleVi: 'Chú cún cưng của tớ',
    category: 'Thế giới động vật',
    icon: '🐶',
    level: 'Cơ bản',
    lines: [
      { id: '1', speaker: 'Jenny', avatar: '👧', text: 'Come meet my new pet dog, Buddy!', vi: 'Đến gặp chú cún cưng mới của tớ này, tên bạn ấy là Buddy!' },
      { id: '2', speaker: 'Noah', avatar: '👦', text: 'Oh, he is so adorable! His soft fur is white and brown.', vi: 'Ôi, bạn cún đáng yêu quá! Bộ lông mềm mại có màu trắng và nâu.' },
      { id: '3', speaker: 'Jenny', avatar: '👧', text: 'Buddy loves running and catching the red ball.', vi: 'Buddy rất thích chạy nhảy và đuổi bắt quả bóng màu đỏ.' },
      { id: '4', speaker: 'Noah', avatar: '👦', text: 'Look, he wags his tail because he is happy to see us!', vi: 'Nhìn kìa, bạn ấy vẫy đuôi mừng rỡ vì vui khi gặp chúng mình đấy!' },
    ],
  },

  // 11
  {
    id: 'd_11_weather',
    titleEn: 'Talking About Today’s Weather',
    titleVi: 'Thời tiết hôm nay thế nào?',
    category: 'Thiên nhiên & Trời',
    icon: '⛅',
    level: 'Cơ bản',
    lines: [
      { id: '1', speaker: 'Grandma', avatar: '👵', text: 'Look out the window, Oliver. How is the weather today?', vi: 'Oliver ơi, nhìn ra ngoài cửa sổ xem thời tiết hôm nay thế nào con?' },
      { id: '2', speaker: 'Oliver', avatar: '👦', text: 'It is sunny and warm, Grandma! There is a gentle cool wind.', vi: 'Hôm nay trời nắng ấm bà ơi! Lại có làn gió nhẹ mát lành nữa.' },
      { id: '3', speaker: 'Grandma', avatar: '👵', text: 'That is wonderful! Do you want to wear your hat and water the flowers?', vi: 'Thật tuyệt vời! Cháu có muốn đội mũ rồi cùng bà tưới hoa ngoài vườn không?' },
      { id: '4', speaker: 'Oliver', avatar: '👦', text: 'Yes, Grandma! I will help you take care of the green garden.', vi: 'Dạ có bà ơi! Cháu sẽ giúp bà chăm sóc vườn cây xanh tươi.' },
    ],
  },

  // 12
  {
    id: 'd_12_clothes',
    titleEn: 'Getting Dressed for School',
    titleVi: 'Mặc quần áo chuẩn bị đi học',
    category: 'Thói quen hàng ngày',
    icon: '👕',
    level: 'Cơ bản',
    lines: [
      { id: '1', speaker: 'Mom', avatar: '👩', text: 'Chloe, it is time to put on your school uniform.', vi: 'Chloe ơi, đã đến giờ mặc đồng phục để chuẩn bị đến trường rồi con.' },
      { id: '2', speaker: 'Chloe', avatar: '👧', text: 'Mom, where are my clean white socks and blue shoes?', vi: 'Mẹ ơi, đôi tất trắng sạch và đôi giày xanh của con ở đâu ạ?' },
      { id: '3', speaker: 'Mom', avatar: '👩', text: 'They are right next to your study table and backpack.', vi: 'Chúng ở ngay cạnh bàn học và chiếc cặp của con này.' },
      { id: '4', speaker: 'Chloe', avatar: '👧', text: 'Thank you Mom! My shirt is tidy and I am ready to go!', vi: 'Con cảm ơn mẹ! Áo quần con gọn gàng và con đã sẵn sàng lên đường rồi!' },
    ],
  },

  // 13
  {
    id: 'd_13_toys',
    titleEn: 'Sharing Toys with Friends',
    titleVi: 'Cùng chia sẻ đồ chơi',
    category: 'Sở thích & Vui chơi',
    icon: '🚂',
    level: 'Cơ bản',
    lines: [
      { id: '1', speaker: 'Liam', avatar: '👦', text: 'Do you want to play with my toy train and red car?', vi: 'Cậu có muốn chơi cùng đoàn tàu hỏa đồ chơi và xe ô tô đỏ của tớ không?' },
      { id: '2', speaker: 'Ethan', avatar: '👦', text: 'Wow, yes! The wooden train looks so cool on the tracks.', vi: 'Oa, có chứ! Đoàn tàu gỗ chạy trên đường ray trông tuyệt thật đấy.' },
      { id: '3', speaker: 'Liam', avatar: '👦', text: 'Here is the remote controller. We can take turns driving it!', vi: 'Đây là điều khiển này. Chúng mình có thể thay phiên nhau lái nhé!' },
      { id: '4', speaker: 'Ethan', avatar: '👦', text: 'Sharing toys together makes playtime twice as fun!', vi: 'Cùng chia sẻ đồ chơi khiến buổi chơi vui hơn gấp đôi!' },
    ],
  },

  // 14
  {
    id: 'd_14_numbers',
    titleEn: 'Counting from 1 to 10',
    titleVi: 'Cùng đếm từ 1 đến 10',
    category: 'Học tập & Trí tuệ',
    icon: '🔢',
    level: 'Cơ bản',
    lines: [
      { id: '1', speaker: 'Teacher Amy', avatar: '🧑‍🏫', text: 'Let us count these shiny stars on the board!', vi: 'Chúng mình hãy cùng đếm những ngôi sao lấp lánh trên bảng nhé!' },
      { id: '2', speaker: 'Class', avatar: '🧒', text: 'One, two, three, four, five stars!', vi: 'Một, hai, ba, bốn, năm ngôi sao!' },
      { id: '3', speaker: 'Teacher Amy', avatar: '🧑‍🏫', text: 'Very good! Can you keep going up to ten?', vi: 'Rất giỏi! Các em có thể đếm tiếp tục đến mười không nào?' },
      { id: '4', speaker: 'Class', avatar: '🧒', text: 'Six, seven, eight, nine, ten! Ten bright golden stars!', vi: 'Sáu, bảy, tám, chín, mười! Mười ngôi sao vàng rực rỡ!' },
    ],
  },

  // 15
  {
    id: 'd_15_polite',
    titleEn: 'Polite Words: Please & Thank You',
    titleVi: 'Lời nói lễ phép: Làm ơn & Cảm ơn',
    category: 'Giao tiếp hàng ngày',
    icon: '🤝',
    level: 'Cơ bản',
    lines: [
      { id: '1', speaker: 'Mom', avatar: '👩', text: 'Remember our golden polite words when you ask for something, dear.', vi: 'Con yêu hãy luôn nhớ những từ ngữ lễ phép khi nhờ vả ai đó nhé.' },
      { id: '2', speaker: 'Ruby', avatar: '👧', text: 'Yes Mom! Can you please give me a glass of water?', vi: 'Dạ vâng mẹ! Mẹ làm ơn cho con xin một cốc nước được không ạ?' },
      { id: '3', speaker: 'Mom', avatar: '👩', text: 'Here is your fresh clean water, my lovely girl.', vi: 'Nước mát sạch sẽ của cô bé ngoan ngoãn đây rồi.' },
      { id: '4', speaker: 'Ruby', avatar: '👧', text: 'Thank you very much, Mom! I love you!', vi: 'Con cảm ơn mẹ rất nhiều ạ! Con yêu mẹ!' },
    ],
  },

  // 16
  {
    id: 'd_16_grandparents',
    titleEn: 'Visiting Grandpa and Grandma',
    titleVi: 'Về thăm ông bà cuối tuần',
    category: 'Gia đình & Người',
    icon: '🏡',
    level: 'Cơ bản',
    lines: [
      { id: '1', speaker: 'Grandpa', avatar: '👴', text: 'Welcome home, children! We missed you so much.', vi: 'Chào mừng các cháu đã về nhà! Ông bà nhớ các cháu nhiều lắm.' },
      { id: '2', speaker: 'Ella', avatar: '👧', text: 'Grandpa! We brought you fresh sweet fruit from the town.', vi: 'Ông ơi! Chúng cháu mang trái cây tươi ngọt từ thị trấn về biếu ông bà này.' },
      { id: '3', speaker: 'Grandma', avatar: '👵', text: 'Come sit down on the chair. I baked warm honey bread for you.', vi: 'Các cháu vào ngồi ghế nghỉ ngơi nhé. Bà vừa nướng bánh mì mật ong ấm nóng cho các cháu đấy.' },
      { id: '4', speaker: 'Ella', avatar: '👧', text: 'Smells so yummy! We love spending weekends with Grandpa and Grandma.', vi: 'Thơm nức mũi luôn bà ơi! Chúng cháu thích nhất là được về chơi với ông bà vào cuối tuần.' },
    ],
  },

  // 17
  {
    id: 'd_17_breakfast',
    titleEn: 'Yummy Breakfast at Home',
    titleVi: 'Bữa sáng ngon lành tại nhà',
    category: 'Món ăn & Đồ uống',
    icon: '🍞',
    level: 'Cơ bản',
    lines: [
      { id: '1', speaker: 'Dad', avatar: '👨', text: 'Breakfast is ready on the table! Come eat while it is warm.', vi: 'Bữa sáng trên bàn đã sẵn sàng rồi! Mau vào ăn khi còn nóng con nhé.' },
      { id: '2', speaker: 'Henry', avatar: '👦', text: 'What is for breakfast today, Dad?', vi: 'Hôm nay nhà mình ăn sáng món gì thế bố?' },
      { id: '3', speaker: 'Dad', avatar: '👨', text: 'We have toasted bread with cheese, a boiled egg, and an orange.', vi: 'Bố có bánh mì nướng phô mai, một quả trứng luộc và quả cam tươi.' },
      { id: '4', speaker: 'Henry', avatar: '👦', text: 'Yum! This breakfast gives me lots of strength for my soccer match.', vi: 'Ngon quá! Bữa sáng này tiếp cho con thật nhiều sức mạnh cho trận đá bóng.' },
    ],
  },

  // 18
  {
    id: 'd_18_help',
    titleEn: 'Helping Clean the Room',
    titleVi: 'Bé ngoan giúp dọn dẹp phòng',
    category: 'Thói quen hàng ngày',
    icon: '🧹',
    level: 'Cơ bản',
    lines: [
      { id: '1', speaker: 'Mom', avatar: '👩', text: 'Can you help me put away your story books neatly?', vi: 'Con có thể giúp mẹ xếp những quyển truyện tranh gọn gàng lại không?' },
      { id: '2', speaker: 'Mason', avatar: '👦', text: 'Yes, Mom! I will arrange the books on the wooden shelf.', vi: 'Dạ được chứ mẹ! Con sẽ xếp sách ngay ngắn lên chiếc kệ gỗ.' },
      { id: '3', speaker: 'Mom', avatar: '👩', text: 'And put your toy cars into the colorful toy box.', vi: 'Và cất những chiếc ô tô đồ chơi vào trong hộp đồ chơi nhiều màu nữa nhé.' },
      { id: '4', speaker: 'Mason', avatar: '👦', text: 'All done! Our clean bedroom looks so neat and comfortable now.', vi: 'Xong hết rồi ạ! Giờ căn phòng ngủ của chúng ta trông sạch sẽ và ngăn nắp quá.' },
    ],
  },

  // 19
  {
    id: 'd_19_bedtime',
    titleEn: 'Bedtime Story & Good Night',
    titleVi: 'Kể chuyện trước giờ đi ngủ',
    category: 'Thói quen hàng ngày',
    icon: '🌙',
    level: 'Cơ bản',
    lines: [
      { id: '1', speaker: 'Mother', avatar: '👩', text: 'Snuggle into your cozy bed. Which story shall we read tonight?', vi: 'Chui vào chăn ấm êm ái nào con yêu. Tối nay mẹ con mình đọc câu chuyện gì nào?' },
      { id: '2', speaker: 'Sophie', avatar: '👧', text: 'Please read the tale of the friendly little bunny and the silver moon.', vi: 'Mẹ đọc câu chuyện về bạn thỏ trắng đáng yêu và vầng trăng bạc đi mẹ.' },
      { id: '3', speaker: 'Mother', avatar: '👩', text: 'Close your tired eyes softly. The stars in the dark sky are watching over you.', vi: 'Nhắm mắt lại thư giãn nào bé cưng. Những vì sao trên bầu trời đêm đang che chở cho con.' },
      { id: '4', speaker: 'Sophie', avatar: '👧', text: 'Good night, sweet dreams Mom. I love you to the moon and back.', vi: 'Chúc mẹ ngủ ngon và có những giấc mơ đẹp. Con yêu mẹ nhiều lắm.' },
    ],
  },

  // 20
  {
    id: 'd_20_goodbye',
    titleEn: 'Saying Goodbye, See You Tomorrow!',
    titleVi: 'Chào tạm biệt, Hẹn gặp lại ngày mai!',
    category: 'Giao tiếp hàng ngày',
    icon: '🎒',
    level: 'Cơ bản',
    lines: [
      { id: '1', speaker: 'Alex', avatar: '👦', text: 'The school bell rings! The school bus is here.', vi: 'Tiếng chuông tan trường reo rồi! Chuyến xe buýt đã tới nơi.' },
      { id: '2', speaker: 'Grace', avatar: '👧', text: 'We had a wonderful day today! I learned many English words.', vi: 'Hôm nay chúng mình đã có một ngày thật tuyệt! Tớ học được bao nhiêu từ tiếng Anh hay.' },
      { id: '3', speaker: 'Alex', avatar: '👦', text: 'Goodbye Grace! Have a safe ride home and rest well.', vi: 'Tạm biệt Grace nhé! Đi về nhà an toàn và nghỉ ngơi thật tốt nha.' },
      { id: '4', speaker: 'Grace', avatar: '👧', text: 'Goodbye Alex! See you tomorrow morning with a big smile!', vi: 'Tạm biệt Alex! Hẹn gặp lại cậu vào sáng mai với nụ cười thật tươi nhé!' },
    ],
  },
];
