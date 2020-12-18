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
                  <el-tag closable @close="removeRightById(ssc.row, item1)">{{
                    item1.authName
                  }}</el-tag>
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
                      ><el-tag
                        type="success"
                        closable
                        @close="removeRightById(ssc.row, item2)"
                        >{{ item2.authName }}</el-tag
                      >
                      <i class="el-icon-caret-right"></i
                    ></el-col>
                    <!-- 渲染三级权限 -->
                    <el-col :span="18"
                      ><el-tag
                        type="warning"
                        v-for="item3 in item2.children"
                        :key="item3.id"
                        closable
                        @close="removeRightById(ssc.row, item3)"
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
          <template v-slot:default="ssc">
            <div>
              <el-button size="mini" type="primary" icon="el-icon-edit"
                >编辑</el-button
              >
              <el-button size="mini" type="danger" icon="el-icon-delete"
                >删除</el-button
              >
              <el-button
                size="mini"
                type="warning"
                icon="el-icon-setting"
                @click="showSetRightDialog(ssc.row)"
                >分配权限
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
    >
      <!-- 树形控件 -->
      <el-tree
        :data="rightlist"
        :props="treeProps"
        show-checkbox
        node-key="id"
        :default-expand-all="true"
        :dafault-checked-keys="[defKeys]"
      ></el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRightDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 定义所有角色列表
      rolelist: [],
      // 所有权限的数据
      rightlist: [],
      // 控制分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      // 树形控件的属性绑定对象
      treeProps: {
        label: "authName",
        children: "children"
      },
      //默认选中的节点id数组
      defKeys: []
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
    async removeRightById(rid, iid) {
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
      const { data: res } = await this.$http.delete(
        `roles/${rid.id}/rights/${iid.id}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除失败");
      }
      rid.children = res.data;
    },
    // 展示分配权限对话框
    async showSetRightDialog(role) {
      // 获取所有权限的数据
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200) {
        return this.$message.error("获取权限失败");
      }
      // 获取到的权限数据保存到数组中
      this.rightlist = res.data;
      // 递归获取三级节点的ID
      this.getLeafKeys(role, this.defKeys);
      console.log(role);
      this.setRightDialogVisible = true;
    },
    // 定义递归函数，获取三级节点id,并保存到 defkeys 数组中
    getLeafKeys(node, arr) {
      // 如果当前节点不包含children属性，说明是三级节点
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach(item => this.getLeafKeys(item, arr));
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
