// react
import React from 'react';
// material-ui
import { styled } from '@mui/material';
// components
import { Sidebar } from '../molecules/Sidebar';
import { CompactHeader, Header } from '../organisms/HeaderBase';
// hooks
import { useFetchLayers } from '../../hooks/useFetchLayers';
import { useFetchMarkers } from '../../hooks/useFetchMarkers';
import { useFetchSpheres } from '../../hooks/useFetchSpheres';
// store
import { useViewPageTemplateViewModel } from '../../viewModels/ViewPageTemplateViewModel';
import { LayerTileGridButton } from '../atoms/LayerTileGridButton';
import { ToggleSidebarButton } from '../atoms/ToggleSidebarButton';
import { ModalNode } from '../molecules/ModalNode';
import { LayerTileGrid } from '../organisms/LayerTileGrid';
import { LayerViewer } from '../organisms/LayerViewer';
import { MarkerViewer } from '../organisms/MarkerViewer';
import { SphereViewer } from '../organisms/SphereViewer';
import { TreeList } from '../organisms/TreeList';

const Layout = styled('div')`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

//header以外をカバーするコンポーネント
const WholeContent = styled('div')`
  display: flex;
  flex: 1;
`;

const Content = styled('main')`
  display: flex;
  flex: 1;
  height: 100%;
  width: 100%;
`;

const OptionalContent = styled('div')`
  position: absolute;
  z-index: 1000;
  top: 10px;
  left: 10px;
`;

interface ViewPageTemplateProps {
  isDesktop: boolean;
  locationId: string;
}

export const ViewPageTemplate: React.FC<ViewPageTemplateProps> = ({
  isDesktop,
  locationId,
}) => {
  const {
    isSidebarOpen,
    activeModal,
    selectedSphereId,
    closeModal,
    handleToggleSidebar,
    clearSelection,
  } = useViewPageTemplateViewModel();

  // カスタムフックの使用
  useFetchLayers(); // 修正箇所
  useFetchSpheres(); // 修正箇所
  useFetchMarkers(); // 修正箇所
  console.log('selectedSphereId:', selectedSphereId);
  const optionalContent = isDesktop ? (
    <OptionalContent>
      <ToggleSidebarButton
        isSidebarOpen={isSidebarOpen}
        onToggle={handleToggleSidebar}
      />
      <LayerTileGridButton onClick={clearSelection} />
    </OptionalContent>
  ) : (
    <OptionalContent>
      <LayerTileGridButton onClick={clearSelection} />
    </OptionalContent>
  );
  const mainContent = selectedSphereId ? (
    <SphereViewer isDesktop={isDesktop} optionalContent={optionalContent} />
  ) : (
    <LayerTileGrid />
  );
  const content: React.ReactNode = (
    <Layout>
      {/* ヘッダ */}
      {isDesktop ? <Header /> : <CompactHeader />}
      <WholeContent>
        {/* サイドバー */}
        {isDesktop && <Sidebar isOpen={isSidebarOpen} content={<TreeList />} />}
        {/* メインコンテンツ */}
        <Content>{mainContent}</Content>
      </WholeContent>
    </Layout>
  );

  return (
    <>
      {content}
      {/* レイヤーモーダルを表示 */}
      <ModalNode
        open={activeModal === 'layer'}
        onClose={closeModal}
        content={<LayerViewer />}
      />
      {/* マーカーモーダルを表示 */}
      <ModalNode
        open={activeModal === 'marker'}
        onClose={closeModal}
        content={<MarkerViewer />}
      />
    </>
  );
};
