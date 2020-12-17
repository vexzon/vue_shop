<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card
      ><el-row>
        <!-- 添加角色按钮 -->
        <el-col><el-button type="primary">添加</el-button></el-col></el-row
      >
      <!-- 角色列表区域 -->
      <el-table :data="rolelist" border stripe>
        <el-table-column type="expand">
          <template v-slot="ssc">
            <div>
              <el-row
                :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
                v-for="(item1, i1) in ssc.row.children"
                :key="item1.id"
              >
                <!-- 渲染一级权限 -->
                <el-col :span="6">
                  <el-tag>{{ item1.authName }}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!-- 渲染二级三级权限 -->
                <el-col :span="18">
                  <!-- 渲染二级权限 -->
                  <el-row
                    :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                    v-for="(item2, i2) in item1.children"
                    :key="item2.id"
                  >
                    <el-col :span="6"
                      ><el-tag type="success" closable>{{
                        item2.authName
                      }}</el-tag>
                      <i class="el-icon-caret-right"></i
                    ></el-col>
                    <!-- 渲染三级权限 -->
                    <el-col :span="18"
                      ><el-tag
                        type="warning"
                        v-for="item3 in item2.children"
                        :key="item3.id"
                        closable
                        @close="removeRightById()"
                        >{{ item3.authName }}</el-tag
                      ></el-col
                    >
                  </el-row>
                </el-col>
              </el-row>
            </div>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template>
            <div>
              <el-button size="mini" type="primary" icon="el-icon-edit"
                >编辑</el-button
              >
              <el-button size="mini" type="danger" icon="el-icon-delete"
                >删除</el-button
              >
              <el-button size="mini" type="warning" icon="el-icon-setting"
                >分配权限</el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 定义所有角色列表
      rolelist: []
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    async getRoleList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色列表失败");
      }
      this.rolelist = res.data;
    },
    // 根据 id 删除对应的权限
    async removeRightById() {
      // 弹框提示
      const confirmResult = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("取消删除");
      }
      console.log("确认删除");
    }
  }
};
</script>
<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eeeeee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
