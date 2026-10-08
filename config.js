/*
 * Chỉnh nội dung trang web ở file này. Không cần sửa HTML/CSS/JS.
 * Ảnh: đặt trong assets/photos/ và cập nhật các đường dẫn ở gallery.
 * Nhạc: đặt trong assets/music/ và cập nhật customMusic; nếu để trống
 * website sẽ dùng một đoạn nhạc sinh nhật mô phỏng bằng Web Audio.
 */
window.BIRTHDAY_CONFIG = {
  recipient: "Mít",
  from: "Một người luôn quý cậu ♡",
  intro: "Có một món quà nho nhỏ đang đợi cậu ở đây...",
  birthdayLabel: "A LITTLE CUTE, JUST FOR YOU",
  cakeMessage: "Nhắm mắt lại, ước một điều và thổi nến nhé! ",
  wishes: [
    { icon: "🌷", title: "Thật nhiều niềm vui", text: "Mong mỗi ngày của cậu đều có một điều bé xíu khiến cậu mỉm cười." },
    { icon: "✨", title: "Những điều diệu kỳ", text: "Mong những điều cậu chờ đợi sẽ đến vào đúng thời điểm đẹp nhất." },
    { icon: "🧸", title: "Luôn được yêu thương", text: "Mong cậu luôn được là chính mình, bình yên và hạnh phúc." }
  ],
  gallery: [
    { src: "assets/photos/photo2.jpg", caption: "Ai mà đáng yêu thíiii", sticker: "🦋", gradient: "lilac" },
    { src: "assets/photos/photo1.jpg", caption: "Tấm này cũng xinh, nhưng người làm web này còn đẹp trai hơn :)", sticker: "🌸", gradient: "peach" },
    { src: "assets/photos/photo3.jpg", caption: "Định ngắm biển mà tự nhiên lại để ý nụ cười của ai đó :)", sticker: "🌷", gradient: "sky" }
  ],
  letterTitle: "Gửi bạn Mít,",
  letter: [
    "Chúc mừng sinh nhật cậu! 🎂",
    "Có thể đây chỉ là một chiếc website nhỏ thôi, nhưng từng ngôi sao, từng bông hoa và từng lời chúc đều được đặt ở đây để dành riêng cho cậu.",
    "Mong tuổi mới của cậu sẽ thật rực rỡ hơn. Hi vọng cậu vẫn sẽ luôn giữ được nụ cười trên môi và mọi điều tốt đẹp sẽ đến với cậu.",
    "Chúc cậu sinh nhật thật đáng nhớ nhé! ♡"
  ],
  ending: "Thế giới có thêm một ngày đáng yêu, vì hôm nay là sinh nhật cậu!",
};
