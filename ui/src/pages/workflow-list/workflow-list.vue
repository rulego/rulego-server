<script lang="js" setup>
import { ref, onMounted, toRaw } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessageBox } from 'element-plus';
import * as Api from '@src/api';
import { saveAs } from 'file-saver';

import { WORKFLOW_MENU_KEY } from '@src/constant/workflow';
import AppCard from '@src/pages/workflow-list/app-card.vue';
import CreateAppModal from '@src/pages/workflow-list/create-app-modal.vue';
import ImportDialog from '@src/pages/workflow-list/import-dialog.vue';

const router = useRouter();

const createAppModalRef = ref();
const importDialogRef = ref();

const paginationState = ref({
  page: 1,
  size: 10,
  pageSizes: [10, 20, 30, 40, 50],
  total: 0,
});
const formState = ref({
  keywords: '',
});
const data = ref([]);

async function refreshData() {
  const res = await Api.getRules({
    page: paginationState.value.page,
    size: paginationState.value.size,
    keywords: formState.value.keywords,
  });
  data.value = res.items;
  paginationState.value.total = res.total;

  console.log('data.value', data);
}

function paginationChangeHandler(currentPage, pageSize) {
  paginationState.value.page = currentPage;
  paginationState.value.size = pageSize;
  refreshData();
}

function openDetail(id, tab = WORKFLOW_MENU_KEY.APP_MANAGE) {
  router.push({ path: '/workflow', query: { id, tab } });
}

function openCreateAppModalHandler() {
  createAppModalRef.value.open();
}
// Import
function importHandler() {
  importDialogRef.value.open();
}

function createAppSuccessHandler(id) {
  openDetail(id);
}
function importSuccessHandler(id) {
  refreshData();
}
function deleteHandler(id, name) {
  ElMessageBox.confirm(
    `Delete [${name}]? This action cannot be undone.`,
    'Warning',
    {
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      type: 'warning',
      callback: async (action) => {
        if (action === 'confirm') {
          await Api.deleteRules(id);
          refreshData();
        }
      },
    },
  );
}

function deploymentHandler(id, name, disabled) {
  const actionName = disabled ? 'Deploy' : 'Take Offline';

  ElMessageBox.confirm(
    `Are you sure you want to ${actionName.toLowerCase()} [${name}]?`,
    'Warning',
    {
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      type: 'warning',
      callback: async (action) => {
        if (action === 'confirm') {
          await Api.deploymentRules(id, disabled);
          refreshData();
        }
      },
    },
  );
}
// Export as JSON
const handleDownloadData = (id, data) => {
  const jsonString = JSON.stringify(data, null, 2);
  let blob = new Blob([jsonString], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, id + '.json');
};
onMounted(() => {
  refreshData();
});
</script>

<template>
  <div class="flex h-full flex-col">
    <div class="flex flex-none items-center justify-between p-4">
      <div>
        <el-button @click="openCreateAppModalHandler">
          <span>Create Application</span>
        </el-button>
        <el-button @click="importHandler">
          <span>Import Application</span>
        </el-button>
      </div>
      <div class="w-[200px] flex-none">
        <el-input
          placeholder="Enter a workflow name"
          :clearable="true"
          v-model="formState.keywords"
          @keyup.enter="refreshData"
        ></el-input>
      </div>
    </div>
    <div class="flex-grow overflow-auto">
      <el-scrollbar class="h-full w-full">
        <div class="flex flex-wrap content-start pl-4">
          <app-card
            v-for="item in data"
            :key="item.ruleChain.id"
            :name="item.ruleChain.name"
            :description="item.ruleChain.additionalInfo.description"
            :disabled="item.ruleChain.disabled"
            @click.prevent="
              item.ruleChain.disabled ? null : openDetail(item.ruleChain.id)
            "
            @delete="deleteHandler(item.ruleChain.id, item.ruleChain.name)"
            @manage="
              openDetail(item.ruleChain.id, WORKFLOW_MENU_KEY.APP_MANAGE)
            "
            @design="
              openDetail(item.ruleChain.id, WORKFLOW_MENU_KEY.APP_DESIGN)
            "
            @export="handleDownloadData(item.ruleChain.id, item)"
            @deployment="
              deploymentHandler(
                item.ruleChain.id,
                item.ruleChain.name,
                item.ruleChain.disabled,
              )
            "
          ></app-card>
        </div>
      </el-scrollbar>
    </div>
    <div class="flex flex-none justify-end p-4">
      <el-pagination
        v-model:current-page="paginationState.page"
        v-model:page-size="paginationState.size"
        size="small"
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="paginationState.pageSizes"
        :total="paginationState.total"
        :background="true"
        @change="paginationChangeHandler"
      ></el-pagination>
    </div>
    <create-app-modal
      ref="createAppModalRef"
      @success="createAppSuccessHandler"
    ></create-app-modal>

    <import-dialog
      ref="importDialogRef"
      @success="importSuccessHandler"
    ></import-dialog>
  </div>
</template>
