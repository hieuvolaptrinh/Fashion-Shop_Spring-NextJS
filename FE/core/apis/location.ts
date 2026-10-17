export interface AdministrativeUnit {
  code: string;
  name_with_type: string;
  district_name?: string;
}

// Bộ nhớ đệm (in-memory cache) tránh gọi lại API liên tục gây trễ và nghẽn mạng
let cachedProvinces: AdministrativeUnit[] | null = null;
const cachedWardsByProvince = new Map<string, AdministrativeUnit[]>();

/**
 * Lấy danh sách Tỉnh/Thành phố từ Open API
 */
export const fetchProvinces = async (): Promise<AdministrativeUnit[]> => {
  if (cachedProvinces && cachedProvinces.length > 0) {
    return cachedProvinces;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch("https://provinces.open-api.vn/api/p/", {
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) throw new Error(`Fetch provinces failed with status ${response.status}`);
    const list: Array<{ code: number | string; name: string }> = await response.json();
    if (Array.isArray(list) && list.length > 0) {
      cachedProvinces = list.map((item) => ({
        code: String(item.code),
        name_with_type: item.name,
      }));
      return cachedProvinces;
    }
  } catch (error) {
    console.warn("Lỗi khi tải danh sách Tỉnh/Thành từ Open API:", error);
  }

  return cachedProvinces || [];
};

/**
 * Lấy danh sách Xã/Phường trực tiếp theo Tỉnh/Thành phố (Mô hình 2 cấp hành chính Tỉnh -> Xã)
 */
export const fetchWardsByProvince = async (
  provinceCode: string
): Promise<AdministrativeUnit[]> => {
  if (!provinceCode) return [];

  const cleanCode = String(provinceCode).trim();
  if (cachedWardsByProvince.has(cleanCode)) {
    return cachedWardsByProvince.get(cleanCode)!;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(
      `https://provinces.open-api.vn/api/p/${cleanCode}?depth=3`,
      { cache: "no-store", signal: controller.signal }
    );
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Fetch wards by province ${cleanCode} failed with status ${response.status}`);
    }

    const json = await response.json();
    if (Array.isArray(json?.districts)) {
      const wards: AdministrativeUnit[] = [];
      for (const dist of json.districts) {
        if (Array.isArray(dist.wards)) {
          for (const w of dist.wards) {
            wards.push({
              code: String(w.code),
              name_with_type: w.name,
              district_name: dist.name,
            });
          }
        }
      }
      if (wards.length > 0) {
        cachedWardsByProvince.set(cleanCode, wards);
      }
      return wards;
    }
  } catch (error) {
    console.warn(`Lỗi khi tải danh sách Xã/Phường cho tỉnh ${cleanCode}:`, error);
  }
  return [];
};

/**
 * Legacy: Lấy danh sách Quận/Huyện theo mã Tỉnh/Thành (nếu màn hình khác cần)
 */
export const fetchDistricts = async (provinceCode: string): Promise<AdministrativeUnit[]> => {
  if (!provinceCode) return [];
  const cleanCode = String(provinceCode).trim();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(
      `https://provinces.open-api.vn/api/p/${cleanCode}?depth=2`,
      { cache: "no-store", signal: controller.signal }
    );
    clearTimeout(timeoutId);

    if (!response.ok) throw new Error("Fetch districts failed");
    const json = await response.json();
    if (Array.isArray(json?.districts)) {
      return json.districts.map((item: any) => ({
        code: String(item.code),
        name_with_type: item.name,
      }));
    }
  } catch (error) {
    console.warn(`Lỗi khi tải Quận/Huyện cho tỉnh ${cleanCode}:`, error);
  }
  return [];
};

/**
 * Legacy: Lấy danh sách Phường/Xã theo mã Quận/Huyện (nếu màn hình khác cần)
 */
export const fetchWards = async (districtCode: string): Promise<AdministrativeUnit[]> => {
  if (!districtCode) return [];
  const cleanCode = String(districtCode).trim();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(
      `https://provinces.open-api.vn/api/d/${cleanCode}?depth=2`,
      { cache: "no-store", signal: controller.signal }
    );
    clearTimeout(timeoutId);

    if (!response.ok) throw new Error("Fetch wards failed");
    const json = await response.json();
    if (Array.isArray(json?.wards)) {
      return json.wards.map((item: any) => ({
        code: String(item.code),
        name_with_type: item.name,
      }));
    }
  } catch (error) {
    console.warn(`Lỗi khi tải Phường/Xã cho quận ${cleanCode}:`, error);
  }
  return [];
};
