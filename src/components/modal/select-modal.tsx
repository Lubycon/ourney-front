import React, { useState } from 'react';
import styled from '@emotion/styled';
import { mediaQuery, pxToVw } from 'styles/media';
import { MemberInfo } from 'api/types';
import Profile from 'components/profile';
import { Heading4 } from 'styles/typography';
// import color from 'styles/colors';
import { Close } from 'styles/icon';
import { flexCenter, flexAlignCenter } from 'styles/containers';
import { modalStyle } from './button-modal';

const Wrap = styled.div`
  width: ${pxToVw(326)};
  min-height: auto;
  flex-direction: column;
  border-radius: 16px;
  box-sizing: border-box;
  padding-bottom: ${pxToVw(20)};

  ${mediaQuery(640)} {
    width: 326px;
    padding-bottom: 20px;
  }
`;

const List = styled.form`
  width: 100%;
`;

const Input = styled.input`
  display: none;

  &:checked ~ label > div {
    background: rgba(88, 90, 241, 0.4);
  }
`;

const Label = styled.label`
  & > div {
    padding: ${pxToVw(6)} ${pxToVw(24)};

    ${mediaQuery(640)} {
      padding: 6px 24px;
    }
  }
`;

const CloseButton = styled.div`
  width: 44px;
  height: 44px;
  ${flexCenter};
  margin-right: ${pxToVw(8)};

  ${mediaQuery(640)} {
    margin-right: 8px;
  }
`;

const Header = styled.div`
  width: 100%;
  height: ${pxToVw(68)};
  ${flexAlignCenter};
  justify-content: space-between;

  ${mediaQuery(640)} {
    height: 68px;
  }
`;

const Title = styled(Heading4)`
  margin-left: ${pxToVw(24)};

  ${mediaQuery(640)} {
    margin-left: 24px;
  }
`;

const Option = styled.div`
  margin-bottom: ${pxToVw(4)};

  ${mediaQuery(640)} {
    margin-bottom: 4px;
  }
`;

interface SelectModalProps {
  members: MemberInfo[];
  closeModal?: () => void;
}

export default function SelectModal({ members, closeModal }: SelectModalProps) {
  const [checked, setChecked] = useState(0);
  return (
    <Wrap style={modalStyle.content}>
      <Header>
        <Title>낸 사람 선택</Title>
        <CloseButton onClick={closeModal}>
          <Close />
        </CloseButton>
      </Header>
      <List>
        {members.map(({ userId, nickName, profile, me }, index) => (
          <Option>
            <Input
              type="radio"
              id={nickName}
              name="payer"
              value={userId}
              checked={index === checked}
              onClick={() => setChecked(index)}
            />
            <Label htmlFor={nickName}>
              <Profile nickName={nickName} type={profile} isMe={me} hasName />
            </Label>
          </Option>
        ))}
      </List>
    </Wrap>
  );
}
