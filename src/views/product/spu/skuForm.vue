<template>
  <el-form label-width="100px">
    <el-form-item label="SKU Name:">
      <el-input />
    </el-form-item>
    <el-form-item label="Price(RMB):">
      <el-input type="number" />
    </el-form-item>
    <el-form-item label="Weight(g):">
      <el-input type="number" />
    </el-form-item>
    <el-form-item label="SKU Desc:">
      <el-input type="textarea" />
    </el-form-item>
    <el-form-item label="Platform Attr:">
      <el-form inline label-width="90px">
        <el-form-item label="Class One:">
          <el-select>
            <el-option />
          </el-select>
        </el-form-item>
        <el-form-item label="Battery:">
          <el-select>
            <el-option />
          </el-select>
        </el-form-item>
        <el-form-item label="Memory:">
          <el-select>
            <el-option />
          </el-select>
        </el-form-item>
        <el-form-item label="Storage:">
          <el-select>
            <el-option />
          </el-select>
        </el-form-item>
        <el-form-item label="CPU:">
          <el-select>
            <el-option />
          </el-select>
        </el-form-item>
        <el-form-item label="Screen Size:">
          <el-select>
            <el-option />
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="Sale Attr:">
      <el-form label-width="90px">
        <el-form-item label="Color:">
          <el-select>
            <el-option />
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="Picture:">
      <el-table border :data="[1, 2, 3, 4]">
        <el-table-column
          type="selection"
          align="center"
          width="80px"
        ></el-table-column>
        <el-table-column label="Picture"></el-table-column>
        <el-table-column label="Name"></el-table-column>
        <el-table-column label="Operation"></el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" style="width: 75px">Save</el-button>
      <el-button type="warning" style="width: 75px" @click="handleCancelAddSKU">
        Cancel
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
//自定义事件
const $emit = defineEmits(['changeScene'])
//点击取消添加SKU按钮回调
const handleCancelAddSKU = () => {
  $emit('changeScene', { scene: 0, type: '' })
}
</script>

<style lang="scss" scoped></style>
