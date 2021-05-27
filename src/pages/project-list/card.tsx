import React, { useState } from 'react';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { mediaQuery } from 'styles/media';
import { changeStringToDate, makeDateFormat } from 'utils';
import { Heading4 as Title, Heading7 } from 'styles/typography';
import color from 'styles/colors';
import Members, { MemberInfo } from 'components/members';

const CardWrap = styled.div<{ isCurrent: boolean }>`
  width: 100%;
  margin-bottom: 16px;
  border: ${({ isCurrent }) => (isCurrent ? `2px solid ${color.primary}` : `1px solid ${color.grayscale.gray05}`)};
  border-radius: 8px;
  padding: 24px 16px;
  box-sizing: border-box;
  box-shadow: ${({ isCurrent }) => isCurrent && '0px 4px 16px rgba(88, 90, 241, 0.2)'};
`;

const MoreWrap = styled.div`
  position: relative;
`;

const More = styled.div`
  width: 24px;
  height: 24px;
  background: url('./images/ico_more.svg') center no-repeat;
  background-size: contain;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

const Desc = styled(Heading7)`
  color: ${color.grayscale.gray02};
  margin-bottom: 28px;

  ${mediaQuery(640)} {
    margin-bottom: 56px;
  }
`;

const MoreModal = styled.div`
  width: 200px;
  height: 137px;
  position: absolute;
  top: 13px;
  right: -36px;
  padding: 0 36px;
  box-sizing: border-box;
  background: url('/images/modal_sm.svg') center no-repeat;
  background-size: auto;
  z-index: 2;
`;

const MoreButton = styled(Heading7)`
  padding: 10px 0;
  line-height: 1;

  &:first-of-type {
    margin-top: 36px;
  }
`;

interface CardProps {
  tripName: string;
  startDate: string;
  endDate: string;
  memberCnt: number;
  members: MemberInfo[];
  isCurrent?: boolean;
}

export default function Card({ tripName, startDate, endDate, memberCnt, isCurrent = false, members }: CardProps) {
  const [openMore, setOpenMore] = useState(false);
  const sDate = changeStringToDate(startDate);
  const eDate = changeStringToDate(endDate);

  return (
    <CardWrap isCurrent={isCurrent}>
      <div
        css={css`
          display: flex;
          justify-content: space-between;
        `}
      >
        <Title>{tripName}</Title>
        <MoreWrap>
          <More onClick={() => setOpenMore(true)} />
          {openMore ? (
            <>
              <Overlay onClick={() => setOpenMore(false)} />
              <ActionModal />
            </>
          ) : null}
        </MoreWrap>
      </div>
      <Desc>{`${makeDateFormat(sDate)} - ${makeDateFormat(eDate)}, ${memberCnt}명`}</Desc>
      <Members members={members} />
    </CardWrap>
  );
}

function ActionModal() {
  return (
    <MoreModal>
      <MoreButton onClick={() => console.log('수정')}>여행정보수정</MoreButton>
      <MoreButton
        onClick={() => console.log('나가기')}
        css={css`
          color: ${color.red};
        `}
      >
        나가기
      </MoreButton>
    </MoreModal>
  );
}
