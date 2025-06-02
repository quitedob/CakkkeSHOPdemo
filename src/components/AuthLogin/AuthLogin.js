// 引入 vue 的 ref，用于响应式数据
import { ref } from "vue";
// 引入 useRouter，用于路由跳转
import { useRouter } from "vue-router";
// 引入 axios 发送请求
import axios from "axios";

export default {
    name: "Login",
    setup() {
        // 定义响应式变量：用户名、密码、错误信息、登录状态、登录尝试次数
        const username = ref("");
        const password = ref("");
        const errorMessage = ref("");
        const isLoggingIn = ref(false);
        const loginAttempts = ref(0);
        // 获取路由实例
        const router = useRouter();

        // 登录方法，发送请求并处理登录逻辑
        const handleLogin = async () => {
            if (!username.value || !password.value) {
                errorMessage.value = "用户名和密码不能为空";
                setTimeout(() => errorMessage.value = "", 3000);
                return;
            }

            isLoggingIn.value = true;

            try {
                const response = await axios.post("/admin/employee/login", {
                    username: username.value,
                    password: password.value,
                });

                // 假设登录成功的返回码为 1
                if (response.data.code === 1 && response.data.data.token) {
                    localStorage.setItem("token", response.data.data.token);
                    localStorage.setItem("userInfo", JSON.stringify({
                        id: response.data.data.id,
                        name: response.data.data.name
                    }));

                    // 重置登录尝试次数
                    loginAttempts.value = 0;

                    // 跳转到工作台页面
                    router.push("/dashboard");
                } else {
                    throw new Error(response.data.msg || "登录失败");
                }
            } catch (error) {
                loginAttempts.value++;

                if (loginAttempts.value >= 5) {
                    errorMessage.value = "账号已锁定，请1小时后重试！";
                } else {
                    errorMessage.value = `输入有误请重试，还剩${5 - loginAttempts.value}次！`;
                }

                setTimeout(() => errorMessage.value = "", 3000);
            } finally {
                isLoggingIn.value = false;
            }
        };

        // 定义点击帮助按钮，显示超级管理员联系方式
        const Helpbotton = () => {
            alert("电话为：xxxxxxxxxxx, 邮箱为：xxxxxxx@xx.com");
        };

        // 返回需要在模板中使用的数据和方法
        return {
            username,
            password,
            errorMessage,
            isLoggingIn,
            handleLogin,
            Helpbotton
        };
    }
};
