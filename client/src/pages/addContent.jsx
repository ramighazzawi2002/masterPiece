import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { debounce } from "lodash";
import Footer from "@/components/footer";

const AddContentPage = () => {
  const navigate = useNavigate();
  const [contentType, setContentType] = useState("article");
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    breif: "",
    image: null,
    description: "",
    topics_covered: [""],
    requirements: [""],
    duration: "",
    start_time: "",
    end_time: "",
    cost: "",
    location: "",
    benefits: [""],
    max_participants: "",
    start_date: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    // Reset form data when content type changes
    setFormData({
      title: "",
      content: "",
      breif: "",
      image: null,
      description: "",
      topics_covered: [""],
      requirements: [""],
      duration: "",
      start_time: "",
      end_time: "",
      cost: "",
      location: "",
      benefits: [""],
      max_participants: "",
      start_date: "",
    });
    setFieldErrors({});
  }, [contentType]);

  const handleChange = e => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData(prevData => ({
        ...prevData,
        [name]: files[0],
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]:
          name === "cost" || name === "max_participants"
            ? parseFloat(value) || ""
            : value,
      }));
    }
    validateField(name, type === "file" ? files[0] : value);
  };

  const handleMultiInputChange = (e, field, index) => {
    const { value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [field]: prevData[field].map((item, i) => (i === index ? value : item)),
    }));
    validateField(field, value);
  };

  const addItem = field => {
    setFormData(prevData => ({
      ...prevData,
      [field]: [...prevData[field], ""],
    }));
  };

  const removeItem = (field, index) => {
    if (formData[field].length > 1) {
      setFormData(prevData => ({
        ...prevData,
        [field]: prevData[field].filter((_, i) => i !== index),
      }));
    }
  };

  const validateField = debounce((name, value) => {
    let error = "";
    switch (name) {
      case "title":
        if (value.length < 3) error = "العنوان يجب أن يكون 3 أحرف على الأقل";
        break;
      case "content":
      case "description":
        if (value.length < 10) error = "المحتوى يجب أن يكون 10 أحرف على الأقل";
        break;
      case "breif":
        if (value.length < 5) error = "النبذة يجب أن تكون 5 أحرف على الأقل";
        break;
      case "image":
        if (!value) error = "الصورة مطلوبة";
        break;
      case "duration":
        if (isNaN(value) || value <= 0)
          error = "المدة يجب أن تكون رقمًا موجبًا";
        break;
      case "cost":
        if (isNaN(value) || value < 0)
          error = "التكلفة يجب أن تكون رقمًا غير سالب";
        break;
      case "max_participants":
        if (isNaN(value) || value <= 0)
          error = "عدد المشاركين يجب أن يكون رقمًا موجبًا";
        break;
      case "topics_covered":
      case "requirements":
      case "benefits":
        if (value.length < 2) error = "يجب أن يكون حرفين على الأقل";
        break;
      case "start_time":
      case "end_time":
        if (!value) error = "الوقت مطلوب";
        break;
      case "start_date":
        if (!value) error = "تاريخ البدء مطلوب";
        break;
    }
    setFieldErrors(prev => ({ ...prev, [name]: error }));
  }, 300);

  const validateForm = () => {
    const requiredFields =
      contentType === "article"
        ? ["title", "content", "breif", "image"]
        : [
            "title",
            "description",
            "topics_covered",
            "requirements",
            "duration",
            "start_date",
            "start_time",
            "end_time",
            "cost",
            "location",
            "benefits",
            "max_participants",
          ];

    const errors = {};
    requiredFields.forEach(field => {
      if (Array.isArray(formData[field])) {
        if (
          formData[field].length === 0 ||
          formData[field].every(item => item === "")
        ) {
          errors[field] = `حقل ${field} مطلوب`;
        }
      } else if (!formData[field]) {
        errors[field] = `حقل ${field} مطلوب`;
      }
    });

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError("يرجى ملء جميع الحقول المطلوبة");
      return false;
    }

    if (Object.values(fieldErrors).some(error => error !== "")) {
      setError("يرجى تصحيح الأخطاء في النموذج");
      return false;
    }

    // Validate start time is before end time
    if (contentType === "workshop") {
      const startTime = new Date(`2000-01-01T${formData.start_time}`);
      const endTime = new Date(`2000-01-01T${formData.end_time}`);
      if (startTime >= endTime) {
        setError("يجب أن يكون وقت البدء قبل وقت الانتهاء");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const endpoint =
        contentType === "article"
          ? "http://localhost:5000/article/add-article"
          : "http://localhost:5000/workshop/add";

      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (Array.isArray(formData[key])) {
          formData[key].forEach((item, index) => {
            formDataToSend.append(`${key}[${index}]`, item);
          });
        } else if (key === "image" && formData[key]) {
          formDataToSend.append("image", formData[key]);
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });
      console.log("formDataToSend", formDataToSend);
      await axios.post(endpoint, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setSuccess("تمت إضافة المحتوى بنجاح");
      setTimeout(() => {
        navigate("/profile");
      }, 2000);
    } catch (error) {
      console.error("Error adding content:", error);
      setError(
        error.response?.data?.message ||
          "حدث خطأ أثناء إضافة المحتوى. يرجى المحاولة مرة أخرى."
      );
    } finally {
      setLoading(false);
    }
  };

  const renderMultiInput = (field, placeholder) => (
    <div>
      {formData[field].map((item, index) => (
        <div key={index} className="flex mb-2">
          <input
            type="text"
            value={item}
            onChange={e => handleMultiInputChange(e, field, index)}
            placeholder={placeholder}
            className={`w-full p-2 border rounded ${
              fieldErrors[field] ? "border-red-500" : ""
            }`}
            required={index === 0}
          />
          {formData[field].length > 1 && (
            <button
              type="button"
              onClick={() => removeItem(field, index)}
              className="mr-2 px-2 py-1 bg-red-500 text-white rounded"
            >
              حذف
            </button>
          )}
        </div>
      ))}
      {fieldErrors[field] && (
        <p className="text-red-500 text-sm mt-1">{fieldErrors[field]}</p>
      )}
      <button
        type="button"
        onClick={() => addItem(field)}
        className="mt-2 px-2 py-1 bg-green-500 text-white rounded"
      >
        إضافة{" "}
        {field === "topics_covered"
          ? "موضوع"
          : field === "requirements"
          ? "متطلب"
          : "فائدة"}
      </button>
    </div>
  );

  return (
    <>
      <div className="bg-amber-50 min-h-screen pt-10 mt-20">
        <main className="container mx-auto mt-8 p-4">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden p-6">
            <h2 className="text-2xl font-bold mb-4">إضافة محتوى جديد</h2>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertTitle>خطأ</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert variant="success" className="mb-4">
                <AlertTitle>نجاح</AlertTitle>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
            <div className="mb-4">
              <label className="block mb-2">نوع المحتوى:</label>
              <select
                value={contentType}
                onChange={e => setContentType(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="article">مقالة</option>
                <option value="workshop">ورشة</option>
              </select>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="العنوان"
                  className={`w-full p-2 border rounded ${
                    fieldErrors.title ? "border-red-500" : ""
                  }`}
                  required
                />
                {fieldErrors.title && (
                  <p className="text-red-500 text-sm mt-1">
                    {fieldErrors.title}
                  </p>
                )}
              </div>
              {contentType === "article" ? (
                <>
                  <div>
                    <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleChange}
                      placeholder="المحتوى"
                      className={`w-full p-2 border rounded ${
                        fieldErrors.content ? "border-red-500" : ""
                      }`}
                      rows="10"
                      required
                    ></textarea>
                    {fieldErrors.content && (
                      <p className="text-red-500 text-sm mt-1">
                        {fieldErrors.content}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      name="breif"
                      value={formData.breif}
                      onChange={handleChange}
                      placeholder="نبذة مختصرة"
                      className={`w-full p-2 border rounded ${
                        fieldErrors.breif ? "border-red-500" : ""
                      }`}
                      required
                    />
                    {fieldErrors.breif && (
                      <p className="text-red-500 text-sm mt-1">
                        {fieldErrors.breif}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      name="image"
                      onChange={handleChange}
                      className={`w-full p-2 border rounded ${
                        fieldErrors.image ? "border-red-500" : ""
                      }`}
                      required
                    />
                    {fieldErrors.image && (
                      <p className="text-red-500 text-sm mt-1">
                        {fieldErrors.image}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="الوصف"
                      className={`w-full p-2 border rounded ${
                        fieldErrors.description ? "border-red-500" : ""
                      }`}
                      rows="4"
                      required
                    ></textarea>
                    {fieldErrors.description && (
                      <p className="text-red-500 text-sm mt-1">
                        {fieldErrors.description}
                      </p>
                    )}
                  </div>
                  {renderMultiInput("topics_covered", "المواضيع المغطاة")}
                  {renderMultiInput("requirements", "المتطلبات")}
                  <div>
                    <input
                      type="number"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      placeholder="المدة بالأيام"
                      className={`w-full p-2 border rounded ${
                        fieldErrors.duration ? "border-red-500" : ""
                      }`}
                      required
                    />
                    {fieldErrors.duration && (
                      <p className="text-red-500 text-sm mt-1">
                        {fieldErrors.duration}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block mb-1 font-semibold">
                      تاريخ البدء
                    </label>
                    <input
                      type="date"
                      name="start_date"
                      value={formData.start_date}
                      onChange={handleChange}
                      className={`w-full p-2 border rounded ${
                        fieldErrors.start_date ? "border-red-500" : ""
                      }`}
                      required
                    />
                    {fieldErrors.start_date && (
                      <p className="text-red-500 text-sm mt-1">
                        {fieldErrors.start_date}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col md:flex-row md:space-x-4">
                    <div className="w-full md:w-1/2 mb-4 md:mb-0">
                      <label className="block mb-1 font-semibold">
                        وقت البدء
                      </label>
                      <input
                        type="time"
                        name="start_time"
                        value={formData.start_time}
                        onChange={handleChange}
                        className={`w-full p-2 border rounded ${
                          fieldErrors.start_time ? "border-red-500" : ""
                        }`}
                        required
                      />
                      {fieldErrors.start_time && (
                        <p className="text-red-500 text-sm mt-1">
                          {fieldErrors.start_time}
                        </p>
                      )}
                    </div>
                    <div className="w-full md:w-1/2">
                      <label className="block mb-1 font-semibold">
                        وقت الانتهاء
                      </label>
                      <input
                        type="time"
                        name="end_time"
                        value={formData.end_time}
                        onChange={handleChange}
                        className={`w-full p-2 border rounded ${
                          fieldErrors.end_time ? "border-red-500" : ""
                        }`}
                        required
                      />
                      {fieldErrors.end_time && (
                        <p className="text-red-500 text-sm mt-1">
                          {fieldErrors.end_time}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    * يرجى تحديد وقت بداية ونهاية الورشة
                  </div>
                  <div>
                    <input
                      type="number"
                      name="cost"
                      value={formData.cost}
                      onChange={handleChange}
                      placeholder="التكلفة"
                      className={`w-full p-2 border rounded ${
                        fieldErrors.cost ? "border-red-500" : ""
                      }`}
                      required
                    />
                    {fieldErrors.cost && (
                      <p className="text-red-500 text-sm mt-1">
                        {fieldErrors.cost}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="المكان"
                      className={`w-full p-2 border rounded ${
                        fieldErrors.location ? "border-red-500" : ""
                      }`}
                      required
                    />
                    {fieldErrors.location && (
                      <p className="text-red-500 text-sm mt-1">
                        {fieldErrors.location}
                      </p>
                    )}
                  </div>
                  {renderMultiInput("benefits", "الفوائد")}
                  <div>
                    <input
                      type="number"
                      name="max_participants"
                      value={formData.max_participants}
                      onChange={handleChange}
                      placeholder="الحد الأقصى للمشاركين"
                      className={`w-full p-2 border rounded ${
                        fieldErrors.max_participants ? "border-red-500" : ""
                      }`}
                      required
                    />
                    {fieldErrors.max_participants && (
                      <p className="text-red-500 text-sm mt-1">
                        {fieldErrors.max_participants}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      name="image"
                      onChange={handleChange}
                      className={`w-full p-2 border rounded ${
                        fieldErrors.image ? "border-red-500" : ""
                      }`}
                      required
                    />
                    {fieldErrors.image && (
                      <p className="text-red-500 text-sm mt-1">
                        {fieldErrors.image}
                      </p>
                    )}
                  </div>
                </>
              )}
              <button
                type="submit"
                className={`bg-customBrown text-white px-4 py-2 rounded hover:bg-customBrown hover:opacity-95 w-full ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading
                  ? "جاري الإضافة..."
                  : contentType === "article"
                  ? "إضافة المقالة"
                  : "إضافة الورشة"}
              </button>
            </form>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default AddContentPage;
