function pageAbout() {

  // 页面跳转
  const { useRouter } = vue;
  const router = useRouter();
  const toHome = document.getElementsByClassName('to-home')[0];
  toHome.addEventListener('click', () => {
    router.push('/')
  })

}