<template>
  <div class="hello-world">{{ msg }}</div>
</template>

<script>
import Foo from "./Foo"

export default {
  components: {
    Foo
  },
  data() {
    return {
      msg: 'Hello World'
    }
  }
}
</script>

<style lang="less" scoped>
.hello {
  &-world {
    color: white;
  }
}
</style>
