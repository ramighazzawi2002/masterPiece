"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Articles",
      [
        {
          title: "فن الفسيفساء في الأردن",
          content: `الفن الفسيفسائي هو أحد أقدم الفنون التي عرفتها البشرية. يتمثل هذا الفن في تجميع قطع صغيرة من الحجارة أو الزجاج أو السيراميك لتشكيل صور فنية رائعة. في الأردن، يمتد تاريخ الفسيفساء إلى العصور القديمة حيث يمكن العثور على العديد من الأمثلة الجميلة في المواقع الأثرية مثل مادبا والبحر الميت. تعتمد تقنيات الفسيفساء على الدقة والصبر، حيث يجب على الفنان ترتيب كل قطعة صغيرة بعناية لتحقيق التصميم النهائي. نستخدم الأدوات اليدوية البسيطة مثل الملاقط والمطارق الصغيرة، وأحيانًا يتم رسم التصميم المبدئي على السطح قبل بدء وضع القطع. الفسيفساء ليست فقط فناً جميلاً ولكنها تحمل أيضًا تاريخًا وثقافة، حيث تعكس التصاميم والأنماط المستخدمة في الفسيفساء الأردنية التراث الثقافي والديني للمنطقة.`,
          breif:
            "اكتشف فن صناعة الفسيفساء المعقد. صمم واصنع قطعتك الخاصة باستخدام تقنيات مستوحاة من الفسيفساء الأردنية القديمة.",
          author_id: 1, // Assuming user with id 1 is the author
          is_approved: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "المأكولات الشعبية الأردنية",
          content: `المأكولات الشعبية الأردنية تعتبر من أشهر المأكولات في المنطقة. تتميز هذه المأكولات بمذاقها الفريد والمكونات الطبيعية التي تستخدم في إعدادها. تشتهر الأردن بالعديد من الأطباق الشهية مثل المنسف والمنقوشة والمناقيش. تعتبر المأكولات الأردنية غنية بالنكهات والتوابل، حيث تستخدم العديد من الأعشاب والتوابل الطبيعية في إعداد الطعام. تعكس المأكولات الشعبية الأردنية تنوع الثقافة الغذائية في المنطقة، حيث تجمع بين العناصر الغذائية الأساسية مثل اللحوم والخضروات والحبوب بطريقة فريدة ولذيذة.`,
          breif:
            "استمتع بتذوق المأكولات الشعبية الأردنية الشهية. اكتشف النكهات الفريدة والمكونات الطبيعية التي تميز المأكولات الأردنية.",
          author_id: 2, // Assuming user with id 2 is the author
          is_approved: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Articles", null, {});
  },
};