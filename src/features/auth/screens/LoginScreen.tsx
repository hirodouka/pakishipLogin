import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  Modal, 
  Pressable 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Lock, Eye, EyeOff, Circle, CheckCircle2, ArrowRight, X } from 'lucide-react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);

  const [resetModalVisible, setResetModalVisible] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} className="flex-1 px-4 py-8">
          {/* Header Text */}
          <View className="mb-6 flex-col items-center">
            <Text className="text-[40px] leading-[44px] font-extrabold text-dark tracking-tight">Hatid Agad,</Text>
            <Text className="text-[40px] leading-[44px] font-extrabold text-primary tracking-tight">Walang Abala.</Text>
          </View>

          {/* Main Card */}
          <View className="bg-white rounded-[32px] px-6 py-8 shadow-sm border border-gray-50">
            <Text className="text-[32px] font-bold text-dark text-center mb-2">Log In</Text>
            <Text className="text-sm text-gray-400 font-medium text-center mb-8 px-4 leading-5">
              Welcome back! Log in to manage your shipments.
            </Text>

            <View className="space-y-5">
              {/* Email Input */}
               <View className="space-y-2">
                 <Text className="text-[11px] font-bold text-primary tracking-widest uppercase ml-1">Email or Mobile Number</Text>
                 <View className="flex-row items-center bg-background/50 border border-primary/20 rounded-[20px] px-4 py-3 h-14">
                   <Mail color="#39B5A8" size={20} opacity={0.6} />
                   <TextInput
                     className="flex-1 ml-3 text-base text-dark font-medium leading-tight"
                     style={{ paddingVertical: 0 }}
                     placeholder="customer@pakiship.com"
                     placeholderTextColor="#a1a1aa"
                     value={email}
                     onChangeText={setEmail}
                     autoCapitalize="none"
                     keyboardType="email-address"
                   />
                 </View>
               </View>

               {/* Password Input */}
               <View className="space-y-2">
                 <Text className="text-[11px] font-bold text-primary tracking-widest uppercase ml-1 mt-4">Password</Text>
                 <View className="flex-row items-center bg-background/50 border border-primary/20 rounded-[20px] px-4 py-3 h-14">
                   <Lock color="#39B5A8" size={20} opacity={0.6} />
                   <TextInput
                     className="flex-1 ml-3 text-base text-dark font-medium leading-tight"
                     style={{ paddingVertical: 0 }}
                     placeholder="••••••••"
                     placeholderTextColor="#a1a1aa"
                     secureTextEntry={secureTextEntry}
                     value={password}
                     onChangeText={setPassword}
                   />
                   <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)}>
                     {secureTextEntry ? (
                       <Eye color="#a1a1aa" size={20} />
                     ) : (
                       <EyeOff color="#a1a1aa" size={20} />
                     )}
                   </TouchableOpacity>
                 </View>
               </View>

               {/* Remember Me & Forgot Password */}
               <View className="flex-row items-center justify-between mt-6 px-1">
                 <TouchableOpacity 
                   className="flex-row items-center" 
                   onPress={() => setRememberMe(!rememberMe)}
                 >
                   <View className="mr-2">
                     {rememberMe ? (
                       <CheckCircle2 color="#39B5A8" size={20} />
                     ) : (
                       <Circle color="#d4d4d8" size={20} />
                     )}
                   </View>
                   <Text className="text-[13px] font-medium text-gray-500">Remember me</Text>
                 </TouchableOpacity>
                 
                 <TouchableOpacity onPress={() => setResetModalVisible(true)}>
                   <Text className="text-[13px] font-bold text-primary">Forgot Password?</Text>
                 </TouchableOpacity>
               </View>

               {/* Continue Button */}
               <TouchableOpacity className="bg-dark rounded-2xl h-[56px] items-center justify-center mt-6 shadow-md shadow-dark/20">
                 <Text className="text-white font-bold tracking-widest uppercase text-sm">Continue</Text>
               </TouchableOpacity>

               {/* Create Account Link */}
               <View className="flex-row justify-center mt-8 pt-2 border-t border-gray-100">
                 <Text className="text-gray-400 font-medium text-sm">New to PakiSHIP? </Text>
                 <TouchableOpacity>
                   <Text className="text-primary font-bold text-sm underline">Create Account</Text>
                 </TouchableOpacity>
               </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Reset Password Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={resetModalVisible}
        onRequestClose={() => setResetModalVisible(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          className="flex-1"
        >
          <View className="flex-1 justify-end bg-dark/60 relative">
            <Pressable 
              className="absolute inset-0" 
              onPress={() => setResetModalVisible(false)} 
            />
            <View className="bg-white rounded-t-[36px] px-7 pt-7 pb-12 w-full shadow-2xl relative">
             <TouchableOpacity 
               className="absolute top-7 right-7 z-10 p-2"
               onPress={() => setResetModalVisible(false)}
             >
               <X color="#d1d5db" size={24} strokeWidth={2} />
             </TouchableOpacity>

             <View className="w-16 h-16 rounded-[20px] bg-[#F1FAF8] items-center justify-center mb-6">
               <Lock color="#39B5A8" size={26} strokeWidth={2.5} />
             </View>

             <Text className="text-[32px] font-extrabold text-dark tracking-tight mb-2">Reset Password</Text>
             <Text className="text-sm font-medium text-gray-400 mb-8">
               Enter your details to receive a reset link.
             </Text>

             <View className="bg-[#F7FDFB] border border-[#e6f5f2] rounded-3xl px-5 h-[60px] justify-center mb-6">
               <TextInput
                 className="flex-1 text-base text-dark font-medium leading-tight"
                 style={{ paddingVertical: 0 }}
                 placeholder="Email or Mobile"
                 placeholderTextColor="#A4D7D2"
                 value={resetEmail}
                 onChangeText={setResetEmail}
                 autoCapitalize="none"
               />
             </View>

             <TouchableOpacity className="bg-[#9EE0D3] rounded-[30px] h-[60px] flex-row items-center justify-center">
               <Text className="text-white font-extrabold tracking-widest uppercase text-xs mr-2">Send Reset Link</Text>
               <ArrowRight color="white" size={18} strokeWidth={3} />
             </TouchableOpacity>
          </View>
        </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}
