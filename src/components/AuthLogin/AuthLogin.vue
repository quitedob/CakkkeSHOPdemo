<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-logo">
        <span class="logo-text">蛋糕店管理系统</span>
      </div>

      <h1 class="login-title">管理员登录</h1>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="login-form-group">
          <label for="username" class="login-label">用户名</label>
          <input
              type="text"
              id="username"
              v-model="username"
              placeholder="请输入账号"
              class="login-input"
              required
          />
        </div>

        <div class="login-form-group">
          <label for="password" class="login-label">密码</label>
          <input
              type="password"
              id="password"
              v-model="password"
              placeholder="请输入密码"
              class="login-input"
              required
          />
        </div>

        <div v-if="errorMessage" class="login-error">
          {{ errorMessage }}
        </div>

        <button
            type="submit"
            class="login-button"
            :disabled="!username || !password || isLoggingIn"
        >
          <span v-if="!isLoggingIn">登录</span>
          <span v-else>登录中...</span>
        </button>
      </form>

      <div class="login-help">
        <p>
          忘记密码？请联系
          <!-- 点击“超级管理员”调用 Helpbotton 方法 -->
          <a class="admin-link" @click="Helpbotton">超级管理员</a>
        </p>
      </div>
    </div>

    <div class="login-instructions">
      <div class="instructions-header">
        <span>——登录页面说明——</span>
      </div>
      <div class="instructions-content">
        <h3>登录页-定义</h3>
        <p>蛋糕店管理系统后台登录页面，管理员可以通过账号密码登录系统后台</p>

        <h3>页面开发规则</h3>
        <ol>
          <li>密码登录（账号、密码不能为空）</li>
          <li>若为空提示：不能为空</li>
          <li>不为空，验证是否正确
            <ul>
              <li>正确：登录成功，进入系统</li>
              <li>错误：提示语3秒：输入有误请重试，还剩4次！</li>
            </ul>
          </li>
          <li>错误次数限制5次，5次后提示：账号锁定，请1小时后重试！</li>
          <li>登录成功后，跳转至工作台页面</li>
          <li>系统后台不做密码找回，忘记账号密码联系超级管理员</li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script src="./AuthLogin.js"></script>
<style scoped src="./AuthLogin.css"></style>
