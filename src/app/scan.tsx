import {
  CameraView,
  useCameraPermissions,
  type BarcodeScanningResult,
} from 'expo-camera';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { MEAL_NAMES } from '@/features/food-log/constants';
import { BRAND, FONTS } from '@/theme';
import { useFoodLogContext } from '@/features/food-log/context';
import type { MealName } from '@/features/food-log/types';
import {
  fetchProductByBarcode,
  ProductNotFoundError,
} from '@/services/openFoodFacts';

const BARCODE_TYPES = ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128'] as const;

type ScanStatus =
  | { kind: 'scanning' }
  | { kind: 'looking-up'; barcode: string }
  | { kind: 'not-found' }
  | { kind: 'network-error' };

export default function ScanScreen() {
  const router = useRouter();
  const { meal } = useLocalSearchParams<{ meal?: string }>();
  const targetMeal: MealName | null = MEAL_NAMES.includes(meal as MealName)
    ? (meal as MealName)
    : null;
  const { setLastScanned, setScanTarget } = useFoodLogContext();
  const [permission, requestPermission] = useCameraPermissions();
  const [status, setStatus] = useState<ScanStatus>({ kind: 'scanning' });

  const lockRef = useRef(false);

  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const handleBarcodeScanned = useCallback(
    async ({ data }: BarcodeScanningResult) => {
      if (lockRef.current || !data) return;
      lockRef.current = true;
      setStatus({ kind: 'looking-up', barcode: data });

      try {
        const product = await fetchProductByBarcode(data);
        setScanTarget(targetMeal);
        setLastScanned(product);
        router.back();
      } catch (error) {
        setStatus(
          error instanceof ProductNotFoundError
            ? { kind: 'not-found' }
            : { kind: 'network-error' },
        );
      }
    },
    [router, setLastScanned, setScanTarget, targetMeal],
  );

  const scanAgain = () => {
    lockRef.current = false;
    setStatus({ kind: 'scanning' });
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color={'#FFFFFF'} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.title}>Camera access needed</Text>
        <Text style={styles.body}>
          We use the camera to scan food barcodes. Nothing is recorded or
          uploaded.
        </Text>
        {permission.canAskAgain ? (
          <Pressable style={styles.primaryButton} onPress={requestPermission}>
            <Text style={styles.primaryButtonText}>Allow camera</Text>
          </Pressable>
        ) : (
          <Pressable
            style={styles.primaryButton}
            onPress={() => Linking.openSettings()}>
            <Text style={styles.primaryButtonText}>Open settings</Text>
          </Pressable>
        )}
        <Pressable style={styles.secondaryButton} onPress={() => router.back()}>
          <Text style={styles.secondaryButtonText}>Cancel</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: [...BARCODE_TYPES] }}
        onBarcodeScanned={status.kind === 'scanning' ? handleBarcodeScanned : undefined}
      />

      <View style={styles.overlay} pointerEvents="box-none">
        <View style={styles.frame} />

        <View style={styles.statusBox}>
          {status.kind === 'scanning' && (
            <Text style={styles.statusText}>Point camera at barcode</Text>
          )}
          {status.kind === 'looking-up' && (
            <>
              <ActivityIndicator color={'#FFFFFF'} style={styles.spinner} />
              <Text style={styles.statusText}>
                Barcode: {status.barcode}
                {'\n'}Searching Open Food Facts...
              </Text>
            </>
          )}
          {status.kind === 'not-found' && (
            <Text style={styles.statusText}>
              Product not found.{'\n'}Try adding it manually.
            </Text>
          )}
          {status.kind === 'network-error' && (
            <Text style={styles.statusText}>
              Network error.{'\n'}Check your connection.
            </Text>
          )}

          {(status.kind === 'not-found' || status.kind === 'network-error') && (
            <Pressable style={styles.primaryButton} onPress={scanAgain}>
              <Text style={styles.primaryButtonText}>Scan again</Text>
            </Pressable>
          )}
        </View>

        <Pressable
          style={styles.cancelButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Cancel scanning">
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BRAND.ink,
    justifyContent: 'center',
  },
  centered: {
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontFamily: FONTS.displayMedium,
    color: BRAND.bone,
    fontSize: 22,
    marginBottom: 10,
    textAlign: 'center',
  },
  body: {
    fontFamily: FONTS.sans,
    color: 'rgba(250,248,243,0.72)',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  frame: {
    width: 240,
    height: 150,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  statusBox: {
    marginTop: 24,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  spinner: {
    marginBottom: 8,
  },
  statusText: {
    fontFamily: FONTS.mono,
    color: BRAND.bone,
    fontSize: 13.5,
    lineHeight: 22,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowRadius: 4,
  },
  primaryButton: {
    marginTop: 16,
    backgroundColor: BRAND.wheat,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  primaryButtonText: {
    fontFamily: FONTS.monoMedium,
    color: BRAND.ink,
    fontSize: 12.5,
    letterSpacing: 0.8,
  },
  secondaryButton: {
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  secondaryButtonText: {
    fontFamily: FONTS.sans,
    color: 'rgba(250,248,243,0.6)',
    fontSize: 14,
  },
  cancelButton: {
    position: 'absolute',
    bottom: 48,
    backgroundColor: 'rgba(250,248,243,0.15)',
    borderRadius: 24,
    paddingHorizontal: 28,
    paddingVertical: 12,
  },
  cancelText: {
    fontFamily: FONTS.monoMedium,
    color: BRAND.bone,
    fontSize: 13,
    letterSpacing: 0.8,
  },
});
