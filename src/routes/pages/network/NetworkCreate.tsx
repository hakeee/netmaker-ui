import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { NmForm } from "../../../components/form/Form";
import { NmFormInputSwitch } from "../../../components/form/FormSwitchInput";
import { NmFormInputText } from "../../../components/form/FormTextInput";
import { createNetwork } from "../../../store/modules/network/actions";
import { authSelectors } from "../../../store/selectors";

interface CreateNetwork {
  addressrange: string;
  netid: string;
  localrange: string;
  islocal: boolean;
  isdualstack: boolean;
  addressrange6: string;
  defaultudpholepunch: boolean;
}

const initialState: CreateNetwork = {
  addressrange: "",
  netid: "",
  localrange: "",
  islocal: false,
  isdualstack: false,
  addressrange6: "",
  defaultudpholepunch: true,
};

export const NetworkCreate: React.FC = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const token = useSelector(authSelectors.getToken);

  const onSubmit = useCallback(
    (data: CreateNetwork) => {
      dispatch(
        createNetwork.request({
          token: token!,
          newNetwork: {
            ...data,
            islocal: data.islocal ? "yes" : "no",
            isdualstack: data.isdualstack ? "yes" : "no",
            defaultudpholepunch: data.defaultudpholepunch ? "yes" : "no",
          },
        })
      );
    },
    [dispatch, token]
  );

  return (
    <NmForm
      initialState={initialState}
      onSubmit={onSubmit}
      submitProps={{
        variant: "outlined",
      }}
      submitText={t("network.create.submit")}
      sx={{
        paddingTop: "1em",
        flex: 1,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        width: "100%",
        flexWrap: "wrap",
        "& .MuiTextField-root": {
          m: 1,
          width: "25ch",
          justifyContent: "center",
          flex: "1 0 40%",
        },
        "& .MuiSwitch-root": {
          m: 1,
          justifyContent: "center",
          flex: "1 0 20%",
        },
        "& .MuiButton-root": {
          m: 1,
          justifyContent: "center",
          flex: "1 0 100%",
        },
      }}
    >
      <NmFormInputText
        name={"addressrange"}
        label={t("network.addressrange")}
      />
      <NmFormInputText
        name={"addressrange6"}
        label={t("network.addressrange6")}
      />
      <NmFormInputText name={"localrange"} label={t("network.localrange")} />
      <NmFormInputText name={"netid"} label={t("network.netid")} />
      <NmFormInputSwitch
        name={"isdualstack"}
        label={t("network.isdualstack")}
      />
      <NmFormInputSwitch name={"islocal"} label={t("network.islocal")} />
      <NmFormInputSwitch
        name={"defaultudpholepunch"}
        label={t("network.defaultudpholepunch")}
      />
      <br />
    </NmForm>
  );
};
