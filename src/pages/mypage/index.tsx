import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import useModal from 'hooks/useModal';
import ButtonModal from 'components/modal/button-modal';
import styled from '@emotion/styled';
import _ from 'lodash';
import { basicWrap, flexCenter } from 'styles/containers';
import { Heading7 } from 'styles/typography';
import Profile, { Animals, IconSize } from 'components/profile';
import color from 'styles/colors';
import InputBox from 'components/input-box';
import Button, { ButtonType } from 'components/button';
import Footer from 'components/footer';
import { CheckMark } from 'styles/icon';
import { SubButtonWrap as CommonButtonWrap, Caption, Divider } from 'components/footer';
import { useGetMyPage, useEditMyPage, usePostWithdrawal } from 'hooks/data/useMyPage';
import Loading from 'pages/loading';
import { mediaQuery, pxToVw } from 'styles/media';

const IconSelector = styled.div`
  padding: 6.1333333333vw 0 5.0666666667vw;
  display: flex;
  flex-direction: column;
  align-items: center;

  ${mediaQuery(640)} {
    padding: 23px 0 19px;
  }
`;

const Icons = styled.div`
  width: 50.1333333333vw;
  height: 25.6vw;
  margin-top: 4.2666666667vw;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  ${mediaQuery(640)} {
    width: 188px;
    height: 96px;
    margin-top: 16px;
  }
`;

const ProfileWrap = styled.div`
  margin-bottom: 2.1333333333vw;
  z-index: 2;
  position: relative;
  cursor: pointer;

  ${mediaQuery(640)} {
    margin-bottom: 8px;
  }
`;

const MarkWrap = styled.div`
  background-color: rgba(88, 90, 241, 0.4);
  width: 100%;
  height: 100%;
  border-radius: 100%;
  position: absolute;
  ${flexCenter};
`;

const ButtonWrap = styled.div`
  margin-top: ${pxToVw(32)};

  ${mediaQuery(640)} {
    margin-top: 32px;
  }
`;

const SubButtonWrap = styled(CommonButtonWrap)`
  margin-top: ${pxToVw(57)};

  ${mediaQuery(640)} {
    margin-top: 57px;
  }
`;

const Label = styled(Heading7)`
  color: ${color.white};
`;

export default function MyPage() {
  const [selected, setSelected] = useState<Animals>(Animals.Hamster);
  const [nickname, setNickname] = useState('');
  const history = useHistory();

  const { data, isLoading } = useGetMyPage();
  const { refetch: modifyMyinfo } = useEditMyPage({
    nickName: nickname,
    profileImg: selected
  });
  const { refetch: postWithdrawal } = usePostWithdrawal();

  useEffect(() => {
    if (data) {
      setNickname(data.nickName);
      setSelected(data.profileImg);
    }
  }, [data]);

  const handleChange = _.throttle((value: string) => {
    const newValue = value.replace(/^\s+|\s+$/g, '');
    setNickname(newValue);
  }, 500);

  const handleSubmit = async () => {
    await modifyMyinfo();
    history.push('/projects');
  };

  const LogoutModalContents = (
    <ButtonModal
      title="로그아웃"
      body="정말 로그아웃 하시겠어요?"
      buttons={{
        left: {
          label: '취소'
        },
        right: {
          label: '로그아웃',
          handleClick: () => {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            history.push('/home');
          }
        }
      }}
    />
  );

  const WithdrawModalContents = (
    <ButtonModal
      type="withdraw"
      title="정말 탈퇴하시겠어요?"
      body="디빗을 탈퇴하면 나의 여행정산내역이 모두 사라져요. 그래도 탈퇴하시겠어요?"
      buttons={{
        left: {
          label: '탈퇴',
          handleClick: () => {
            postWithdrawal();
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            history.push('/home');
          }
        },
        right: {
          label: '취소',
          handleClick: () => {}
        }
      }}
    />
  );

  const { handleOpen: openLogoutModal, renderModal: renderLogoutModal } = useModal({
    children: LogoutModalContents
  });

  const { handleOpen: openWithdrawModal, renderModal: renderWithdrawModal } = useModal({
    children: WithdrawModalContents
  });

  if (isLoading) {
    <Loading />;
  }

  return (
    <>
      {renderLogoutModal()}
      {renderWithdrawModal()}
      <div css={basicWrap}>
        <IconSelector>
          <Profile type={selected} iconSize={IconSize.XL} />
          <Icons>
            {Object.values(Animals).map((option) => (
              <ProfileWrap key={option} onClick={() => setSelected(option)}>
                {selected === option && (
                  <MarkWrap>
                    <CheckMark theme={color.white} />
                  </MarkWrap>
                )}
                <Profile type={option} />
              </ProfileWrap>
            ))}
          </Icons>
        </IconSelector>
        <InputBox
          label="이름"
          note="최소 1자 최대 4자 입력가능해요."
          defaultValue={nickname}
          onChangeInput={handleChange}
          maxLength={4}
          minLength={1}
        />
        <ButtonWrap>
          <Button onClick={handleSubmit} disabled={!nickname.length}>
            <Label>저장</Label>
          </Button>
        </ButtonWrap>
        <SubButtonWrap>
          <Button buttonType={ButtonType.Text} onClick={openWithdrawModal}>
            <Caption>회원탈퇴</Caption>
          </Button>
          <Divider />
          <Button buttonType={ButtonType.Text} onClick={openLogoutModal}>
            <Caption>로그아웃</Caption>
          </Button>
        </SubButtonWrap>
      </div>
      <Footer />
    </>
  );
}
