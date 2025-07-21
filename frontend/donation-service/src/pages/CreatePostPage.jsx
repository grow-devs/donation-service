import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import postapi from "../apis/postapi";

const categories = [
  { id: 1, name: "아동·청소년" },
  { id: 2, name: "환경" },
  { id: 3, name: "동물" },
  { id: 4, name: "어르신" },
  { id: 5, name: "사회" },
  { id: 6, name: "지구촌" },
  { id: 7, name: "장애인" },
];

export default function CreatePostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [deadline, setDeadline] = useState(null);
  const [categoryId, setCategoryId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [teamId, setTeamId] = useState("");

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const quillRef = useRef(null);

  // Snackbar 열기 함수
  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  // Snackbar 닫기 함수
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  // 대표 이미지 파일 업로드 핸들러
  const handleImageFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // 파일 크기 검증 (5MB 제한)
      if (file.size > 5 * 1024 * 1024) {
        showSnackbar("이미지 파일은 5MB 이하여야 합니다.", "error");
        return;
      }

      // 파일 타입 검증
      if (!file.type.startsWith("image/")) {
        showSnackbar("이미지 파일만 업로드 가능합니다.", "error");
        return;
      }

      setImageFile(file);

      // 미리보기 생성
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);

      showSnackbar("이미지가 선택되었습니다.", "success");
    }
  };

  // 이미지 제거 핸들러
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
    // 파일 input 초기화
    const fileInput = document.getElementById("image-file-input");
    if (fileInput) {
      fileInput.value = "";
    }
  };
  //게시물 에디터 안의 이미지 핸들러
  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      console.log(file);
      if (file) {
        try {
          // 실제 이미지 업로드 API 호출 로직
          const formData = new FormData();
          formData.append('image', file);
           
          const res = await postapi.post("/post/upload", formData);
          const imageUrlToInsert = res.data.data;
          console.log(imageUrlToInsert);
          // 테스트용. 랜덤이미지 url 적용
          // const imageUrlToInsert = `https://picsum.photos/640/480?random=${Math.random()}`;

          const editor = quillRef.current.getEditor();
          const range = editor.getSelection();

          editor.insertEmbed(range.index, "image", imageUrlToInsert);
          editor.setSelection(range.index + 1);
          showSnackbar("이미지가 성공적으로 삽입되었습니다!", "success");
        } catch (error) {
          console.error("이미지 업로드 실패:", error);
          showSnackbar("이미지 업로드에 실패했습니다.", "error");
        }
      } else {
        showSnackbar("이미지 선택이 취소되었습니다.", "info");
      }
    };
  }, []);

  // modules 객체 - useMemo로 메모이제이션하여 재생성 방지
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, false] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
          ],
          ["link", "image"],
          ["clean"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
    }),
    [imageHandler]
  );

  // formats 배열 - useMemo로 메모이제이션하여 재생성 방지
  const formats = useMemo(
    () => [
      "header",
      "bold",
      "italic",
      "underline",
      "strike",
      "blockquote",
      "list",
      "bullet",
      "indent",
      "link",
      "image",
    ],
    []
  );

  // handleSubmit 함수를 async로 변경
  const handleSubmit = async (event) => { // <-- 여기에 async 키워드를 추가했습니다.
    
    event.preventDefault();

    if (
      !title.trim() ||
      !content.trim() ||
      !targetAmount ||
      !deadline ||
      !categoryId ||
      !imageFile // 이미지 파일 필수 조건 추가 (필요시)
    ) {
      showSnackbar("모든 필수 필드를 채워주세요.", "error");
      return;
    }

    const formattedDeadline = deadline
      ? deadline.format("YYYY-MM-DDTHH:mm:ss")
      : null;

    // FormData 객체 생성
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);

    const parsedTargetAmount = Number(targetAmount);
    if (isNaN(parsedTargetAmount) || parsedTargetAmount <= 0) {
      // 숫자가 아니거나 0 이하인 경우
      showSnackbar("유효한 목표 모금 금액을 입력해주세요.", "error");
      return;
    }
    formData.append("targetAmount", parsedTargetAmount.toString());
    formData.append("deadline", formattedDeadline ?? ""); // null 대신 빈 문자열
    formData.append("categoryId", categoryId.toString());
    formData.append("currentAmount", "0"); //테스트용
    formData.append("participants", "0"); //테스트용
    if (imageFile) {
      formData.append("imageFile", imageFile);
    }

    console.log("게시물 등록 데이터 (FormData):");
    // FormData 내용을 직접 콘솔에 찍기 어려우므로, 각 필드를 확인하거나 백엔드에서 로그로 확인하세요.
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }
    console.log("선택된 이미지 파일:", imageFile);

    try {
      console.log("API 호출 시도 중...");
      const res = await postapi.post("/post", formData, 
        // postData 대신 formData 사용
        // headers: {
        //   "Content-Type": "multipart/form-data", // 필수
        // },
      );

      if (res.status === 201 || res.status === 200) {
        showSnackbar(
          "모금 요청이 완료되었습니다. 수락을 기다려주세요!",
          "success"
        );
        // 성공 시 폼 필드 초기화
        setTitle("");
        setContent("");
        setTargetAmount("");
        setDeadline(null);
        setCategoryId("");
        setImageFile(null);
        setImagePreview("");
      } else {
        // 서버에서 200/201이 아닌 다른 성공 코드를 보낼 경우 대비
        showSnackbar(
          "게시물 등록에 실패했습니다: " +
            (res.data?.message || "알 수 없는 오류"),
          "error"
        );
      }
    } catch (err) {
      console.error("게시물 등록 중 오류 발생:", err);
      showSnackbar(
        "게시물 등록 중 오류가 발생했습니다: " +
          (err.response?.data?.message || err.message),
        "error"
      );
    }
  };
  // 디버깅용: content 상태 변화를 감시
  useEffect(() => {
    console.log("Content state updated to:", content);
  }, [content]);

  // 디버깅용: 컴포넌트 마운트/언마운트 로깅
  useEffect(() => {
    console.log("CreatePostPage Mounted");
    return () => {
      console.log("CreatePostPage Unmounted");
    };
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            align="center"
            sx={{ mb: 4, fontWeight: "bold" }}
          >
            새 게시물 등록
          </Typography>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {/* 제목 입력 */}
              <TextField
                label="게시물 제목"
                variant="outlined"
                fullWidth
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              {/* 내용 입력 (Quill 에디터) */}
              <Box sx={{ minHeight: 300, "& .ql-editor": { minHeight: 250 } }}>
                <ReactQuill
                  ref={quillRef}
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  modules={modules}
                  formats={formats}
                  placeholder="게시물 내용을 입력하세요. 사진도 첨부할 수 있습니다."
                />
              </Box>

              {/* 목표 모금 금액 */}
              <TextField
                label="목표 모금 금액"
                variant="outlined"
                fullWidth
                type="number"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                required
                inputProps={{ min: 1000 }}
              />

              {/* 마감 기한 (DatePicker) */}
              <DatePicker
                label="마감 기한 *"
                value={deadline}
                onChange={(newValue) => setDeadline(newValue)}
                renderInput={(params) => (
                  <TextField {...params} fullWidth required />
                )}
              />

              {/* 카테고리 선택 */}
              <FormControl fullWidth required>
                <InputLabel id="category-select-label">카테고리</InputLabel>
                <Select
                  labelId="category-select-label"
                  id="category-select"
                  value={categoryId}
                  label="카테고리"
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* 게시물 대표 이미지 업로드 */}
              <Box>
                <Typography variant="h6" gutterBottom>
                  게시물 대표 이미지 *
                </Typography>
                <Stack spacing={2}>
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    sx={{ height: 56 }}
                  >
                    이미지 파일 선택
                    <input
                      id="image-file-input"
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      hidden
                    />
                  </Button>

                  {imagePreview && (
                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        미리보기:
                      </Typography>
                      <Box
                        sx={{ position: "relative", display: "inline-block" }}
                      >
                        <img
                          src={imagePreview}
                          alt="미리보기"
                          style={{
                            width: "100%",
                            maxWidth: "300px",
                            height: "auto",
                            borderRadius: "8px",
                            border: "1px solid #ddd",
                          }}
                        />
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={handleRemoveImage}
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            minWidth: "auto",
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            fontSize: "12px",
                          }}
                        >
                          ×
                        </Button>
                      </Box>
                      {imageFile && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 1 }}
                        >
                          파일명: {imageFile.name} (
                          {(imageFile.size / 1024 / 1024).toFixed(2)}MB)
                        </Typography>
                      )}
                    </Box>
                  )}
                </Stack>
              </Box>

              {/* 제출 버튼 */}
              <Button
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
                size="large"
                sx={{ mt: 3 }}
              >
                게시물 등록
              </Button>
            </Stack>
          </form>
        </Paper>
      </Container>

      {/* Snackbar 컴포넌트 */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </LocalizationProvider>
  );
}
