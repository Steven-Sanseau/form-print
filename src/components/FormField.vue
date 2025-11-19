<script setup>
import FieldChoice from "./FieldChoice.vue";
import FieldHeader from "./FieldHeader.vue";

defineProps({
  field: Object,
});
</script>

<template>
  <div class="rounded-lg border bg-card shadow-sm p-6 print-no-break">
    <FieldHeader :field="field" />
    <template v-if="field.type === 'group'">
      <div class="mt-5 space-y-4">
        <FormField
          v-for="field of field.properties.fields"
          :key="field.ref"
          :field="field"
        />
      </div>
    </template>
    <div v-else class="grid grid-flow-col auto-cols-fr gap-6 mt-4">
      <div class="space-y-3 empty:hidden">
        <template v-if="field.properties.choices">
          <FieldChoice
            v-for="choice of field.properties.choices"
            :key="choice.ref"
            :choice="choice"
          />
        </template>
        <template v-if="field.type === 'yes_no'">
          <FieldChoice :choice="{ label: 'Yes' }" />
          <FieldChoice :choice="{ label: 'No' }" />
        </template>
      </div>
      <pre
        class="text-sm text-muted-foreground overflow-x-auto print:whitespace-pre-wrap bg-muted/50 p-4 rounded-md border"
        v-html="field.logic"
      />
    </div>
  </div>
</template>
