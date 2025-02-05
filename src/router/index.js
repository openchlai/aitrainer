import { createRouter, createWebHistory } from 'vue-router'
import DashboardOverview from '../components/DashboardOverview.vue'
import path from 'path'

const routes = [
  {
    path: '/',
    name: 'home',
    component: DashboardOverview
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../components/userAuth.vue')
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../components/DashboardOverview.vue')
  },
  {
    path: '/deployment',
    name: 'deployment',
    component: () => import('../components/ModelDeploymentInterface.vue')
  },
  {
    path: '/feedback',
    name: 'feedback',
    component: () => import('../components/UserFeedbackCollections.vue')
  },
  { path: '/dataset-management', name: 'dataset-management', component: () => import('../components/DatasetManagement.vue') },
  { path: '/model-configuration', name: 'model-configuration', component: () => import('../components/ModelConfiguration.vue') },
  { path: '/training-progress', name: 'training-progress', component: () => import('../components/TrainingProgressMonitor.vue') },
  { path: '/model-evaluation', name: 'model-evaluation', component: () => import('../components/ModelEvaluation.vue') },
  { path: '/transcription', name: 'transcription', component: () => import('../components/BatchUploader.vue') },
  { path: '/model-training', name: 'model-training', component: () => import('../components/ModelTraining.vue') },
  {
    path: '/transcription/:audioId',
    name: 'TranscriptionScreen',
    component: () => import('../components/TranscriptionScreen.vue'),
  },
  {
    path: '/transcribing/:startIndex/:listType',
    name: 'TranscribingScreen',
    component: () => import('../components/TranscribingScreen.vue')
  },
]

const router = createRouter({
  history: createWebHistory('/'),
  routes
})

export default router
